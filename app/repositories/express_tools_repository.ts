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
    const [classes, subjects, annualPlans, semesterPlans, academicYears, semesters] =
      await Promise.all([
        SchoolClass.query().where('user_id', userId).orderBy('name'),
        Subject.query().where('user_id', userId).where('is_active', true).orderBy('name'),
        AnnualPlan.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
        SemesterPlan.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
        AcademicYear.query().where('is_active', true).orderBy('name', 'desc'),
        Semester.query().where('is_active', true).preload('academicYear').orderBy('name'),
      ])
    return { classes, subjects, annualPlans, semesterPlans, academicYears, semesters }
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
