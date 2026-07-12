import type { HttpContext } from '@adonisjs/core/http'
import SemesterPlan from '#models/semester_plan'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import { createSemesterPlanValidator, updateSemesterPlanValidator } from '#validators/semester_plan'

export default class SemesterPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlans = await SemesterPlan.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('semester')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .orderBy('name')

    const semesters = await Semester.query()
      .where('isActive', true)
      .preload('academicYear')

    return inertia.render('dashboard/semester-plans/index', {
      promes: semesterPlans,
      kelas: classes,
      semester: semesters,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('semester')
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    return inertia.render('dashboard/semester-plans/show', {
      promes: semesterPlan,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSemesterPlanValidator)

    await SemesterPlan.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Program Semester berhasil dibuat')
    return response.redirect().toRoute('semester-plans.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    const data = await request.validateUsing(updateSemesterPlanValidator)
    await semesterPlan.merge(data).save()

    session.flash('success', 'Program Semester berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const semesterPlan = await SemesterPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!semesterPlan) {
      return response.redirect('/semester-plans')
    }

    await semesterPlan.delete()

    session.flash('success', 'Program Semester berhasil dihapus')
    return response.redirect().toRoute('semester-plans.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, semesterId, subject } = request.only(['classId', 'semesterId', 'subject'])

    // Future implementation: Integrate with AI service (OpenAI)
    const content = {
      minggu: [],
      kegiatan: [],
      target: [],
      materi: [],
    }

    const semesterPlan = await SemesterPlan.create({
      userId: user.id,
      classId,
      semesterId,
      subject,
      content,
    })

    session.flash('success', 'Program Semester berhasil digenerate')
    return response.redirect().toRoute('semester-plans.show', { id: semesterPlan.id })
  }
}
