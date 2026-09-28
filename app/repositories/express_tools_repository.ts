import AnnualPlan from '#models/annual_plan'
import AcademicYear from '#models/academic_year'
import Exam from '#models/exam'
import Lkpd from '#models/lkpd'
import ReportNarrative from '#models/report_narrative'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import SemesterPlan from '#models/semester_plan'
import Subject from '#models/subject'
import TeachingModule from '#models/teaching_module'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import CurriculumCp from '#models/curriculum_cp'
import db from '@adonisjs/lucid/services/db'

export class ExpressToolsRepository {
  async getModulAjarData(userId: number, isTk: boolean) {
    const [classes, subjects] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query().where('user_id', userId).where('is_active', true).orderBy('name'),
    ])

    if (isTk) {
      const weeklyLessonPlans = await WeeklyLessonPlan.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .orderBy('created_at', 'desc')
      return { classes, subjects, weeklyLessonPlans, teachingModules: [] as TeachingModule[] }
    }

    const teachingModules = await TeachingModule.query()
      .where('user_id', userId)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')
    return { classes, subjects, weeklyLessonPlans: [] as WeeklyLessonPlan[], teachingModules }
  }

  async getLkpdData(userId: number) {
    const [classes, recentLkpds] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Lkpd.query().where('user_id', userId).orderBy('created_at', 'desc'),
    ])
    return { classes, recentLkpds }
  }

  async getSoalData(userId: number) {
    const [classes, subjects, recentExams] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query().where('user_id', userId).where('is_active', true).orderBy('name'),
      Exam.query().where('user_id', userId).orderBy('created_at', 'desc'),
    ])
    return { classes, subjects, recentExams }
  }

  async getProtaPromesData(userId: number) {
    const [classes, subjects, annualPlans, semesterPlans, academicYears, semesters, cps] =
      await Promise.all([
        SchoolClass.query().where('user_id', userId).orderBy('name'),
        Subject.query().where('user_id', userId).where('is_active', true).orderBy('name'),
        AnnualPlan.query()
          .where('user_id', userId)
          .preload('academicYear')
          .orderBy('created_at', 'desc')
          .limit(15),
        SemesterPlan.query()
          .where('user_id', userId)
          .preload('schoolClass')
          .preload('semester')
          .orderBy('created_at', 'desc')
          .limit(15),
        AcademicYear.query().where('is_active', true).orderBy('name', 'desc'),
        Semester.query().where('is_active', true).preload('academicYear').orderBy('name'),
        CurriculumCp.query().orderBy('id', 'asc'),
      ])
    return { classes, subjects, annualPlans, semesterPlans, academicYears, semesters, cps }
  }

  async resolveOrCreateProtaPromesReferences(params: {
    userId: number
    academicYearId?: number
    academicYearName?: string
    semesterId?: number
    semesterName?: string
    classId?: number
    className?: string
  }) {
    // 1. Resolve or create AcademicYear
    let academicYear: AcademicYear | null = null
    if (params.academicYearId) {
      academicYear = await AcademicYear.find(params.academicYearId)
    }
    if (!academicYear) {
      const yearName = params.academicYearName?.trim() || '2025/2026'
      academicYear = await AcademicYear.firstOrCreate(
        { name: yearName },
        { name: yearName, isActive: true }
      )
    }

    // 2. Resolve or create Semester
    let semester: Semester | null = null
    if (params.semesterId) {
      semester = await Semester.query()
        .where('id', params.semesterId)
        .where('academic_year_id', academicYear.id)
        .first()
    }
    if (!semester) {
      const semName = params.semesterName?.trim() || 'Ganjil'
      semester = await Semester.firstOrCreate(
        { academicYearId: academicYear.id, name: semName },
        { academicYearId: academicYear.id, name: semName, isActive: true }
      )
    }

    // 3. Resolve or create SchoolClass
    let schoolClass: SchoolClass | null = null
    if (params.classId) {
      schoolClass = await SchoolClass.query()
        .where('id', params.classId)
        .where('user_id', params.userId)
        .first()
    }
    if (!schoolClass) {
      const className = params.className?.trim() || 'Kelompok B'
      schoolClass = await SchoolClass.query()
        .where('user_id', params.userId)
        .where('academic_year_id', academicYear.id)
        .where('name', className)
        .first()

      if (!schoolClass) {
        let gradeLevel = 1
        if (className.includes('A') || className.includes('B')) {
          gradeLevel = 0
        }
        schoolClass = await SchoolClass.create({
          userId: params.userId,
          academicYearId: academicYear.id,
          name: className,
          gradeLevel,
        })
      }
    }

    return { academicYear, semester, schoolClass }
  }

  async findProtaPromesReferences(
    userId: number,
    classId: number,
    academicYearId: number,
    semesterId: number
  ) {
    const [schoolClass, academicYear, semester] = await Promise.all([
      SchoolClass.query().where('id', classId).where('user_id', userId).first(),
      AcademicYear.query().where('id', academicYearId).where('is_active', true).first(),
      Semester.query()
        .where('id', semesterId)
        .where('is_active', true)
        .preload('academicYear')
        .first(),
    ])

    if (!schoolClass || !academicYear || !semester) return null
    if (schoolClass.academicYearId !== academicYear.id) return null
    if (semester.academicYearId !== academicYear.id) return null

    return { schoolClass, academicYear, semester }
  }

  async createSingleAnnualPlan(params: {
    userId: number
    academicYearId: number
    subject: string
    annualContent: Record<string, any>
  }) {
    return AnnualPlan.create({
      userId: params.userId,
      academicYearId: params.academicYearId,
      subject: params.subject,
      content: params.annualContent,
    })
  }

  async createSingleSemesterPlan(params: {
    userId: number
    classId: number
    semesterId: number
    subject: string
    semesterContent: Record<string, any>
  }) {
    return SemesterPlan.create({
      userId: params.userId,
      classId: params.classId,
      semesterId: params.semesterId,
      subject: params.subject,
      content: params.semesterContent,
    })
  }

  async createProtaPromes(params: {
    userId: number
    academicYearId: number
    classId: number
    semesterId: number
    subject: string
    annualContent: Record<string, any>
    semesterContent: Record<string, any>
  }) {
    return db.transaction(async (trx) => {
      const annualPlan = await AnnualPlan.create(
        {
          userId: params.userId,
          academicYearId: params.academicYearId,
          subject: params.subject,
          content: params.annualContent,
        },
        { client: trx }
      )
      const semesterPlan = await SemesterPlan.create(
        {
          userId: params.userId,
          classId: params.classId,
          semesterId: params.semesterId,
          subject: params.subject,
          content: params.semesterContent,
        },
        { client: trx }
      )
      return { annualPlan, semesterPlan }
    })
  }

  async getRaporData(userId: number) {
    const [classes, recentNarratives, semesters] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      ReportNarrative.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
      Semester.query().where('is_active', true).preload('academicYear').orderBy('name'),
    ])
    return { classes, recentNarratives, semesters }
  }

  async listClasses(userId: number) {
    return await SchoolClass.query().where('user_id', userId).orderBy('name')
  }
}

export const expressToolsRepository = new ExpressToolsRepository()
