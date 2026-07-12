import type { HttpContext } from '@adonisjs/core/http'
import TeachingModule from '#models/teaching_module'
import SchoolClass from '#models/school_class'
import { createTeachingModuleValidator, updateTeachingModuleValidator } from '#validators/teaching_module'

export default class TeachingModulesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const teachingModules = await TeachingModule.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .orderBy('name')

    return inertia.render('dashboard/teaching-modules/index', {
      modulAjar: teachingModules,
      kelas: classes,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const teachingModule = await TeachingModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!teachingModule) {
      return response.redirect('/teaching-modules')
    }

    return inertia.render('dashboard/teaching-modules/show', {
      modulAjar: teachingModule,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createTeachingModuleValidator)

    await TeachingModule.create({
      ...data,
      userId: user.id,
      status: 'draft',
    })

    session.flash('success', 'Modul Ajar berhasil dibuat')
    return response.redirect().toRoute('teaching-modules.index')
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const teachingModule = await TeachingModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!teachingModule) {
      return response.redirect('/teaching-modules')
    }

    const data = await request.validateUsing(updateTeachingModuleValidator)
    await teachingModule.merge(data).save()

    session.flash('success', 'Modul Ajar berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const teachingModule = await TeachingModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!teachingModule) {
      return response.redirect('/teaching-modules')
    }

    await teachingModule.delete()

    session.flash('success', 'Modul Ajar berhasil dihapus')
    return response.redirect().toRoute('teaching-modules.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const { classId, subject, topic, phase } = request.only(['classId', 'subject', 'topic', 'phase'])

    // Future implementation: Integrate with AI service (OpenAI)
    const content = {
      kompetensiDasar: [],
      tujuanPembelajaran: [],
      kegiatan: [],
      penilaian: [],
      sumberBelajar: [],
    }

    const teachingModule = await TeachingModule.create({
      userId: user.id,
      classId,
      title: `${subject} - ${topic}`,
      subject,
      phase: phase || 'B',
      content,
      status: 'draft',
    })

    session.flash('success', 'Modul Ajar berhasil digenerate')
    return response.redirect().toRoute('teaching-modules.show', { id: teachingModule.id })
  }
}
