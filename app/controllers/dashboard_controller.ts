import type { HttpContext } from '@adonisjs/core/http'
import SchoolClass from '#models/school_class'
import TeachingModule from '#models/teaching_module'
import Exam from '#models/exam'
import AnnualPlan from '#models/annual_plan'
import SemesterPlan from '#models/semester_plan'
import Student from '#models/student'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    // Get stats
    const [totalClasses, totalStudents, totalTeachingModules, totalExams, totalAnnualPlans, totalSemesterPlans] =
      await Promise.all([
        user.isAdmin ? SchoolClass.query().count('* as total') : SchoolClass.query().where('user_id', user.id).count('* as total'),
        user.isAdmin ? Student.query().count('* as total') : Student.query().whereHas('schoolClass', (q) => q.where('user_id', user.id)).count('* as total'),
        user.isAdmin ? TeachingModule.query().count('* as total') : TeachingModule.query().where('user_id', user.id).count('* as total'),
        user.isAdmin ? Exam.query().count('* as total') : Exam.query().where('user_id', user.id).count('* as total'),
        user.isAdmin ? AnnualPlan.query().count('* as total') : AnnualPlan.query().where('user_id', user.id).count('* as total'),
        user.isAdmin ? SemesterPlan.query().count('* as total') : SemesterPlan.query().where('user_id', user.id).count('* as total'),
      ])

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
      stats: {
        classes: Number(totalClasses[0].$extras.total),
        students: Number(totalStudents[0].$extras.total),
        teachingModules: Number(totalTeachingModules[0].$extras.total),
        exams: Number(totalExams[0].$extras.total),
        annualPlans: Number(totalAnnualPlans[0].$extras.total),
        semesterPlans: Number(totalSemesterPlans[0].$extras.total),
      },
      recentTeachingModules,
      recentExams,
    })
  }
}
