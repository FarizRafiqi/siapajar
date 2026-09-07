import AnnualPlan from '#models/annual_plan'
import Exam from '#models/exam'
import Lkpd from '#models/lkpd'
import ReportNarrative from '#models/report_narrative'
import SchoolClass from '#models/school_class'
import SemesterPlan from '#models/semester_plan'
import Subject from '#models/subject'
import TeachingModule from '#models/teaching_module'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

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
    const [classes, subjects, annualPlans, semesterPlans] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query().where('user_id', userId).where('is_active', true).orderBy('name'),
      AnnualPlan.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
      SemesterPlan.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
    ])
    return { classes, subjects, annualPlans, semesterPlans }
  }

  async getRaporData(userId: number) {
    const [classes, recentNarratives] = await Promise.all([
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      ReportNarrative.query().where('user_id', userId).orderBy('created_at', 'desc').limit(10),
    ])
    return { classes, recentNarratives }
  }

  async listClasses(userId: number) {
    return await SchoolClass.query().where('user_id', userId).orderBy('name')
  }
}

export const expressToolsRepository = new ExpressToolsRepository()
