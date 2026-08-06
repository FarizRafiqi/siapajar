import type { HttpContext } from '@adonisjs/core/http'
import TeachingModule from '#models/teaching_module'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import {
  createTeachingModuleValidator,
  updateTeachingModuleValidator,
} from '#validators/teaching_module'
import { generateTeachingModuleValidator } from '#validators/generate'
import { exportTeachingModule } from '#services/export_service'
import { exportTeachingModulePdf } from '#services/pdf_export_service'
import { normalizeStringArraySections, AiServiceError } from '#services/ai_service'
import { teachingModulePrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class TeachingModulesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const teachingModules = await TeachingModule.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('created_at', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')

    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .where('is_active', true)
      .orderBy('name')
    const sequences = await import('#models/learning_sequence').then(({ default: Model }) =>
      Model.query().where('user_id', user.id).orderBy('title')
    )

    return inertia.render('dashboard/teaching-modules/index', {
      teachingModules: teachingModules.map((m) => m.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      subjects: subjects.map((s) => s.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
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

    const workflow = await ensureDocumentWorkflow(user.id, 'teaching_module', teachingModule.id, {
      status: teachingModule.status,
    })
    return inertia.render('dashboard/teaching-modules/show', {
      teachingModule: teachingModule.toJSON(),
      workflow: workflow.toJSON(),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const teachingModule = await TeachingModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!teachingModule) {
      return response.redirect('/teaching-modules')
    }

    const buffer = await exportTeachingModule(teachingModule, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Modul Ajar', teachingModule.title], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const teachingModule = await TeachingModule.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!teachingModule) {
      return response.redirect('/teaching-modules')
    }

    const buffer = await exportTeachingModulePdf(teachingModule, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Modul Ajar', teachingModule.title], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
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
    const workflow = await ensureDocumentWorkflow(user.id, 'teaching_module', teachingModule.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)

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
    const { classId, subject, topic, phase, learningSequenceId } = await request.validateUsing(
      generateTeachingModuleValidator
    )

    // Pastikan kelas milik user yang login
    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelas tidak ditemukan')
      return response.redirect().back()
    }

    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = teachingModulePrompt({ subject, topic, phase })
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, [
        'kompetensiDasar',
        'tujuanPembelajaran',
        'kegiatan',
        'penilaian',
        'sumberBelajar',
      ])
      content.curriculum = curriculum
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError ? error.message : 'Gagal generate modul ajar. Coba lagi.'
      )
      return response.redirect().back()
    }

    const teachingModule = await TeachingModule.create({
      userId: user.id,
      classId,
      title: `${subject} - ${topic}`,
      subject,
      phase,
      content,
      status: 'draft',
    })
    await ensureDocumentWorkflow(user.id, 'teaching_module', teachingModule.id, { status: 'draft' })

    session.flash('success', 'Modul Ajar berhasil digenerate')
    return response.redirect().toRoute('teaching-modules.show', { id: teachingModule.id })
  }
}
