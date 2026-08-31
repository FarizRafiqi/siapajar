import SchoolClass from '#models/school_class'
import TeachingModule from '#models/teaching_module'
import Exam from '#models/exam'
import AnnualPlan from '#models/annual_plan'
import SemesterPlan from '#models/semester_plan'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import DailyLessonPlan from '#models/daily_lesson_plan'
import PaudAssessment from '#models/paud_assessment'
import Student from '#models/student'
import User from '#models/user'
import Lkpd from '#models/lkpd'
import MediaModule from '#models/media_module'

type CountRow = { $extras: { total?: string | number } }

export type DashboardStats = {
  classes: number
  students: number
  teachingModules: number
  exams: number
  annualPlans: number
  semesterPlans: number
  weeklyLessonPlans: number
  dailyLessonPlans: number
  paudAssessments: number
  lkpds: number
  mediaModules: number
}

function count(rows: CountRow[]) {
  return Number(rows[0]?.$extras.total ?? 0)
}

export class DashboardRepository {
  async getTeacherStats(userId: number): Promise<DashboardStats> {
    const [
      totalClasses,
      totalStudents,
      totalTeachingModules,
      totalExams,
      totalAnnualPlans,
      totalSemesterPlans,
      totalWeeklyLessonPlans,
      totalDailyLessonPlans,
      totalPaudAssessments,
      totalLkpds,
      totalMediaModules,
    ] = await Promise.all([
      SchoolClass.query().where('user_id', userId).count('* as total'),
      Student.query()
        .whereHas('schoolClass', (query) => query.where('user_id', userId))
        .count('* as total'),
      TeachingModule.query().where('user_id', userId).count('* as total'),
      Exam.query().where('user_id', userId).count('* as total'),
      AnnualPlan.query().where('user_id', userId).count('* as total'),
      SemesterPlan.query().where('user_id', userId).count('* as total'),
      WeeklyLessonPlan.query().where('user_id', userId).count('* as total'),
      DailyLessonPlan.query().where('user_id', userId).count('* as total'),
      PaudAssessment.query().where('user_id', userId).count('* as total'),
      Lkpd.query().where('user_id', userId).count('* as total'),
      MediaModule.query().where('user_id', userId).count('* as total'),
    ])

    return {
      classes: count(totalClasses),
      students: count(totalStudents),
      teachingModules: count(totalTeachingModules),
      exams: count(totalExams),
      annualPlans: count(totalAnnualPlans),
      semesterPlans: count(totalSemesterPlans),
      weeklyLessonPlans: count(totalWeeklyLessonPlans),
      dailyLessonPlans: count(totalDailyLessonPlans),
      paudAssessments: count(totalPaudAssessments),
      lkpds: count(totalLkpds),
      mediaModules: count(totalMediaModules),
    }
  }

  async getAdminStats() {
    const [
      totalClasses,
      totalStudents,
      totalTeachingModules,
      totalExams,
      totalAnnualPlans,
      totalSemesterPlans,
      totalWeeklyLessonPlans,
      totalDailyLessonPlans,
      totalPaudAssessments,
      totalLkpds,
      totalMediaModules,
      totalUsers,
      totalGuru,
      totalAdmin,
    ] = await Promise.all([
      SchoolClass.query().count('* as total'),
      Student.query().count('* as total'),
      TeachingModule.query().count('* as total'),
      Exam.query().count('* as total'),
      AnnualPlan.query().count('* as total'),
      SemesterPlan.query().count('* as total'),
      WeeklyLessonPlan.query().count('* as total'),
      DailyLessonPlan.query().count('* as total'),
      PaudAssessment.query().count('* as total'),
      Lkpd.query().count('* as total'),
      MediaModule.query().count('* as total'),
      User.query().count('* as total'),
      User.query().where('role', 'guru').count('* as total'),
      User.query().where('role', 'admin').count('* as total'),
    ])

    const stats = {
      classes: count(totalClasses),
      students: count(totalStudents),
      teachingModules: count(totalTeachingModules),
      exams: count(totalExams),
      annualPlans: count(totalAnnualPlans),
      semesterPlans: count(totalSemesterPlans),
      weeklyLessonPlans: count(totalWeeklyLessonPlans),
      dailyLessonPlans: count(totalDailyLessonPlans),
      paudAssessments: count(totalPaudAssessments),
      lkpds: count(totalLkpds),
      mediaModules: count(totalMediaModules),
    }

    return {
      stats,
      adminStats: {
        users: count(totalUsers),
        guru: count(totalGuru),
        admin: count(totalAdmin),
        lkpds: stats.lkpds,
        mediaModules: stats.mediaModules,
      },
    }
  }

  async getRecentResources(userId: number) {
    const [teachingModules, exams, lkpds, mediaModules] = await Promise.all([
      TeachingModule.query().where('user_id', userId).orderBy('created_at', 'desc').limit(5),
      Exam.query().where('user_id', userId).orderBy('created_at', 'desc').limit(5),
      Lkpd.query().where('user_id', userId).orderBy('created_at', 'desc').limit(5),
      MediaModule.query().where('user_id', userId).orderBy('created_at', 'desc').limit(5),
    ])

    return { teachingModules, exams, lkpds, mediaModules }
  }
}

export const dashboardRepository = new DashboardRepository()
