import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import TeachingModule from '#models/teaching_module'
import Exam from '#models/exam'
import AnnualPlan from '#models/annual_plan'
import SemesterPlan from '#models/semester_plan'
import Student from '#models/student'
import User from '#models/user'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const isAdmin = user.isAdmin

    // Get stats
    const [totalClasses, totalStudents, totalTeachingModules, totalExams, totalAnnualPlans, totalSemesterPlans] =
      await Promise.all([
        isAdmin ? SchoolClass.query().count('* as total') : SchoolClass.query().where('user_id', user.id).count('* as total'),
        isAdmin ? Student.query().count('* as total') : Student.query().whereHas('schoolClass', (q) => q.where('user_id', user.id)).count('* as total'),
        isAdmin ? TeachingModule.query().count('* as total') : TeachingModule.query().where('user_id', user.id).count('* as total'),
        isAdmin ? Exam.query().count('* as total') : Exam.query().where('user_id', user.id).count('* as total'),
        isAdmin ? AnnualPlan.query().count('* as total') : AnnualPlan.query().where('user_id', user.id).count('* as total'),
        isAdmin ? SemesterPlan.query().count('* as total') : SemesterPlan.query().where('user_id', user.id).count('* as total'),
      ])

    // Admin-specific stats
    let adminStats = null
    if (isAdmin) {
      const [totalUsers, totalGuru, totalAdmin] = await Promise.all([
        User.query().count('* as total'),
        User.query().where('role', 'guru').count('* as total'),
        User.query().where('role', 'admin').count('* as total'),
      ])
      adminStats = {
        users: Number(totalUsers[0].$extras.total),
        guru: Number(totalGuru[0].$extras.total),
        admin: Number(totalAdmin[0].$extras.total),
      }
    }

    // Get recent items
    const recentTeachingModules = await TeachingModule.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(5)

    const recentExams = await Exam.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(5)

    return inertia.render('dashboard/index', {
      role: user.role,
      stats: {
        classes: Number(totalClasses[0].$extras.total),
        students: Number(totalStudents[0].$extras.total),
        teachingModules: Number(totalTeachingModules[0].$extras.total),
        exams: Number(totalExams[0].$extras.total),
        annualPlans: Number(totalAnnualPlans[0].$extras.total),
        semesterPlans: Number(totalSemesterPlans[0].$extras.total),
      },
      adminStats,
      recentTeachingModules,
      recentExams,
    })
  }
}
