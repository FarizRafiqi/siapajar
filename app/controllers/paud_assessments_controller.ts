import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { rm, unlink } from 'node:fs/promises'
import PaudAssessment from '#models/paud_assessment'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Semester from '#models/semester'
import {
  createPaudAssessmentValidator,
  updatePaudAssessmentValidator,
} from '#validators/paud_assessment'
import LearningObjective from '#models/learning_objective'
import AssessmentAttachment from '#models/assessment_attachment'
import string from '@adonisjs/core/helpers/string'
import { auditService } from '#services/audit_service'
import { exportPaudAssessment } from '#services/export_service'
import { exportPaudAssessmentPdf } from '#services/pdf_export_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

const ATTACHMENT_EXTENSIONS: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

const TYPE_LABELS: Record<string, string> = {
  checklist: 'Ceklis',
  anecdotal_note: 'Catatan Anekdot',
  work_sample: 'Hasil Karya',
  photo_series: 'Foto Berseri',
}

export default class PaudAssessmentsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const assessments = await PaudAssessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (query) => query.orderBy('display_order'))
      .orderBy('date', 'desc')

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('students')
      .orderBy('name')
    const curriculumObjectives = await LearningObjective.query()
      .where((q) => q.whereNull('user_id').orWhere('user_id', user.id))
      .preload('indicators')
      .orderBy('code')

    return inertia.render('dashboard/paud-assessments/index', {
      assessments: assessments.map((a) => ({
        ...a.toJSON(),
        attachments: a.attachments.map((attachment) => ({
          ...attachment.toJSON(),
          url: `/paud-assessments/${a.id}/attachments/${attachment.id}`,
        })),
      })),
      classes: classes.map((c) => c.toJSON()),
      typeLabels: TYPE_LABELS,
      curriculumObjectives: curriculumObjectives.map((objective) => objective.toJSON()),
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await this.findOwnedAssessment(params.id, user.id)
    if (!assessment) return response.redirect('/paud-assessments')
    const buffer = await exportPaudAssessment(assessment, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(
        ['Asesmen PAUD', assessment.student?.fullName, assessment.date.toISODate()],
        'docx'
      )
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await this.findOwnedAssessment(params.id, user.id)
    if (!assessment) return response.redirect('/paud-assessments')
    const buffer = await exportPaudAssessmentPdf(assessment, user, !wantsInlinePreview(request))
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(
        ['Asesmen PAUD', assessment.student?.fullName, assessment.date.toISODate()],
        'pdf'
      ),
      { inline: wantsInlinePreview(request) }
    )
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createPaudAssessmentValidator)
    const content =
      typeof data.content === 'string' ? JSON.parse(data.content) : (data.content ?? {})

    const schoolClass = await SchoolClass.query()
      .where('id', data.classId)
      .where('user_id', user.id)
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelompok tidak ditemukan')
      return response.redirect().back()
    }

    const student = await Student.query()
      .where('id', data.studentId)
      .where('class_id', data.classId)
      .first()

    if (!student) {
      session.flash('error', 'Siswa tidak ditemukan di kelompok ini')
      return response.redirect().back()
    }

    if (data.learningObjectiveId) {
      const objective = await LearningObjective.query()
        .where('id', data.learningObjectiveId)
        .where((q) => q.whereNull('user_id').orWhere('user_id', user.id))
        .first()
      if (!objective) {
        session.flash('error', 'TP yang dipilih tidak valid')
        return response.redirect().back()
      }
    }

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await Semester.query()
        .where('academic_year_id', schoolClass.academicYearId)
        .where('is_active', true)
        .first()
      semesterId = activeSemester?.id ?? null
    }

    const uploadedPaths: string[] = []
    let assessment: PaudAssessment
    try {
      assessment = await db.transaction(async (trx) => {
        const createdAssessment = await PaudAssessment.create(
          {
            userId: user.id,
            classId: data.classId,
            semesterId,
            studentId: data.studentId,
            type: data.type,
            date: data.date,
            content,
            learningObjectiveId: data.learningObjectiveId ?? null,
            iktpIndicatorId: data.iktpIndicatorId ?? null,
            achievementStatus: data.achievementStatus ?? null,
            activity: data.activity ?? null,
            teacherNote: data.teacherNote ?? null,
            evidenceUrl: data.evidenceUrl ?? null,
            evidenceType: data.evidenceType ?? null,
          },
          { client: trx }
        )

        if (['work_sample', 'photo_series'].includes(data.type)) {
          const files = request
            .files('attachments', {
              size: '5mb',
              extnames: Object.keys(ATTACHMENT_EXTENSIONS),
            })
            .slice(0, 10)
          for (const [index, file] of files.entries()) {
            if (!file.isValid || !file.tmpPath) {
              if (file.hasErrors) throw new Error('Lampiran tidak valid')
              continue
            }
            const extension = file.extname?.toLowerCase()
            if (!extension || !ATTACHMENT_EXTENSIONS[extension]) {
              throw new Error('Ekstensi lampiran tidak didukung')
            }
            const storedName = `${string.uuid()}.${extension}`
            const uploadDirectory = `public/uploads/assessments/${user.id}/${createdAssessment.id}`
            const relativePath = `${uploadDirectory}/${storedName}`
            await file.move(uploadDirectory, { name: storedName, overwrite: false })
            if (!file.isValid) throw new Error('Lampiran gagal disimpan')
            uploadedPaths.push(`public/${relativePath}`)
            const attachment = await AssessmentAttachment.create(
              {
                assessmentId: createdAssessment.id,
                userId: user.id,
                originalName: file.clientName,
                storedName,
                url: '',
                mimeType: ATTACHMENT_EXTENSIONS[extension],
                size: file.size,
                displayOrder: index,
              },
              { client: trx }
            )
            attachment.url = `/paud-assessments/${createdAssessment.id}/attachments/${attachment.id}`
            await attachment.save()
          }
        }
        return createdAssessment
      })
    } catch (error) {
      await Promise.all(uploadedPaths.map((filePath) => unlink(filePath).catch(() => {})))
      throw error
    }

    await auditService.record({
      actorId: user.id,
      action: 'assessment.create',
      entityType: 'paud_assessment',
      entityId: assessment.id,
      metadata: { type: data.type, attachmentCount: selectedAttachmentCount(request) },
    })

    session.flash('success', `${TYPE_LABELS[data.type]} berhasil dicatat`)
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await PaudAssessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/paud-assessments')
    }

    const data = await request.validateUsing(updatePaudAssessmentValidator)
    await assessment.merge(data).save()

    session.flash('success', 'Asesmen berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await PaudAssessment.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!assessment) {
      return response.redirect('/paud-assessments')
    }

    const attachmentDirectory = `public/uploads/assessments/${user.id}/${assessment.id}`
    const attachments = await AssessmentAttachment.query().where('assessment_id', assessment.id)
    const storedPaths = attachments.map(
      (attachment) =>
        `public/uploads/assessments/${user.id}/${assessment.id}/${attachment.storedName}`
    )
    await db.transaction(async (trx) => {
      await AssessmentAttachment.query({ client: trx })
        .where('assessment_id', assessment.id)
        .delete()
      await PaudAssessment.query({ client: trx }).where('id', assessment.id).delete()
    })
    await Promise.all(storedPaths.map((filePath) => unlink(filePath).catch(() => {})))
    await rm(attachmentDirectory, { recursive: true, force: true })

    session.flash('success', 'Asesmen berhasil dihapus')
    return response.redirect().toRoute('paud-assessments.index')
  }

  private findOwnedAssessment(id: string | number, userId: number) {
    return PaudAssessment.query()
      .where('id', id)
      .where('user_id', userId)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (query) => query.orderBy('display_order'))
      .first()
  }
}

function selectedAttachmentCount(request: HttpContext['request']) {
  return request.files('attachments').length
}
