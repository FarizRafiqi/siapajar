import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { mkdir, rm, unlink } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import { DateTime } from 'luxon'
import PaudAssessment from '#models/paud_assessment'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Semester from '#models/semester'
import {
  createPaudAssessmentValidator,
  updatePaudAssessmentValidator,
  generateAiPaudAssessmentValidator,
  exportBundlePaudAssessmentValidator,
} from '#validators/paud_assessment'
import LearningObjective from '#models/learning_objective'
import AssessmentAttachment from '#models/assessment_attachment'
import string from '@adonisjs/core/helpers/string'
import { auditService } from '#services/audit_service'
import { exportPaudAssessment, exportPaudAssessmentBundle } from '#services/export_service'
import {
  exportPaudAssessmentPdf,
  exportPaudAssessmentBundlePdf,
} from '#services/pdf_export_service'
import { paudAssessmentAiService } from '#services/paud_assessment_ai_service'
import { parseAssessmentContent } from '#services/paud_assessment_export_service'
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
  checklist: 'Ceklis IKTP',
  anecdotal_note: 'Catatan Anekdot',
  work_sample: 'Hasil Karya',
  photo_series: 'Foto Berseri',
}

async function resolveUser(ctx: HttpContext): Promise<User | null> {
  const authHeader = ctx.request.header('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [userId] = decoded.split(':')
      if (userId) return User.find(userId)
    } catch {}
  }
  return ctx.auth?.user || null
}

function isApi(ctx: HttpContext): boolean {
  return (
    ctx.request.url().startsWith('/api/') ||
    (ctx.request.accepts(['json', 'html']) === 'json' && !ctx.request.header('x-inertia'))
  )
}

export default class PaudAssessmentsController {
  async index(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const assessments = await PaudAssessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (query) => query.orderBy('display_order'))
      .orderBy('date', 'desc')

    if (isApi(ctx)) {
      return ctx.response.ok({
        status: 'success',
        data: assessments.map((a) => ({
          ...a.toJSON(),
          attachments: a.attachments.map((att) => ({
            ...att.toJSON(),
            url: `/storage/assessments/${att.storedName}`,
          })),
        })),
      })
    }

    const classes = await SchoolClass.query()
      .where('user_id', user.id)
      .preload('students')
      .orderBy('name')

    const curriculumObjectives = await LearningObjective.query()
      .where((q) => q.whereNull('user_id').orWhere('user_id', user.id))
      .preload('indicators')
      .orderBy('code')

    return ctx.inertia.render('dashboard/paud-assessments/index', {
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

  /**
   * Mobile API: GET /api/v1/students/:id/timeline
   */
  async getStudentTimeline(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const studentId = ctx.params.id
    const assessments = await PaudAssessment.query()
      .where('student_id', studentId)
      .preload('learningObjective')
      .preload('attachments', (q) => q.orderBy('display_order'))
      .orderBy('date', 'desc')

    return ctx.response.ok({
      status: 'success',
      data: assessments.map((a) => {
        const weekNum = Number(a.content?.weekNumber) || 2
        const semNum = Number(a.content?.semesterNumber) || 1
        const tpLabel = a.learningObjective
          ? `${a.learningObjective.code} - ${a.learningObjective.title}`
          : a.learningObjectiveId
            ? `TP ${a.learningObjectiveId}`
            : 'TP 1.3 - Capaian Pembelajaran'

        return {
          id: String(a.id),
          instrumentType: a.type,
          instrumentTitle: TYPE_LABELS[a.type] || 'Asesmen',
          date: a.date.toISODate(),
          dateText: a.date.toFormat('dd MMMM yyyy'),
          activity: a.activity,
          notes: a.teacherNote,
          achievementStatus: a.achievementStatus,
          tpCode: tpLabel,
          weekNumber: weekNum,
          semesterNumber: semNum,
          attachments: a.attachments.map((att) => ({
            id: String(att.id),
            fileName: att.originalName,
            url: att.url || `/storage/assessments/${att.storedName}`,
          })),
        }
      }),
    })
  }

  /**
   * Mobile API: POST /api/v1/assessments/quick-capture
   */
  async quickCapture(ctx: HttpContext) {
    const user = await resolveUser(ctx)
    if (!user) return ctx.response.unauthorized({ message: 'Unauthorized' })

    const { classId, studentIds, instrumentType, notes, activity, date } = ctx.request.all()

    const parsedStudentIds = Array.isArray(studentIds)
      ? studentIds
      : typeof studentIds === 'string'
        ? studentIds.split(',').map((id: string) => id.trim())
        : []

    if (parsedStudentIds.length === 0) {
      return ctx.response.badRequest({ message: 'Minimal 1 siswa wajib dipilih' })
    }

    const typeMapping: Record<
      string,
      'checklist' | 'anecdotal_note' | 'work_sample' | 'photo_series'
    > = {
      CATATAN_ANEKDOT: 'anecdotal_note',
      HASIL_KARYA: 'work_sample',
      FOTO_BERSERI: 'photo_series',
      CEKLIS_CAPAIAN: 'checklist',
      anecdotal_note: 'anecdotal_note',
      work_sample: 'work_sample',
      photo_series: 'photo_series',
      checklist: 'checklist',
    }

    const resolvedType = typeMapping[instrumentType] || 'anecdotal_note'
    const assessmentDate = date ? DateTime.fromISO(date) : DateTime.now()

    const photoFile = ctx.request.file('photo', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let savedFileName: string | null = null
    if (photoFile && photoFile.isValid) {
      const fileName = `${randomUUID()}.${photoFile.extname}`
      const uploadDir = app.makePath('storage/uploads/assessments')
      await mkdir(uploadDir, { recursive: true })
      await photoFile.move(uploadDir, { name: fileName })
      savedFileName = fileName
    }

    const createdAssessments: PaudAssessment[] = []

    for (const sId of parsedStudentIds) {
      const assessment = await PaudAssessment.create({
        userId: user.id,
        classId: Number(classId) || 1,
        studentId: Number(sId),
        type: resolvedType,
        activity: activity || 'Kegiatan Pembelajaran',
        teacherNote: notes || '',
        date: assessmentDate,
      })

      if (savedFileName) {
        await AssessmentAttachment.create({
          assessmentId: assessment.id,
          userId: user.id,
          originalName: photoFile?.clientName || 'Foto Asesmen',
          storedName: savedFileName,
          url: `/storage/assessments/${savedFileName}`,
          size: photoFile?.size || 0,
          mimeType: photoFile?.type || 'image/jpeg',
          displayOrder: 1,
        })
      }

      createdAssessments.push(assessment)
    }

    return ctx.response.created({
      status: 'success',
      message: `${createdAssessments.length} Asesmen berhasil dicatat`,
      data: {
        assessmentIds: createdAssessments.map((a) => String(a.id)),
      },
    })
  }

  /**
   * Endpoint AI drafting khusus untuk Asesmen PAUD/RA (memotong kuota paket aktif user)
   */
  async generateAi({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(generateAiPaudAssessmentValidator)

    let studentName = ''
    if (data.studentId) {
      const student = await Student.find(data.studentId)
      studentName = student?.fullName || ''
    }

    let className = ''
    if (data.classId) {
      const cls = await SchoolClass.find(data.classId)
      className = cls?.name ? `Kelompok ${cls.name}` : ''
    }

    try {
      if (data.type === 'anecdotal_note') {
        const result = await paudAssessmentAiService.generateAnecdotal(user, {
          studentName,
          className,
          theme: data.theme,
          context: data.context,
          observedBehaviorNotes: data.observedBehaviorNotes || 'Anak aktif berinteraksi',
        })
        return response.json({ success: true, result })
      }

      if (data.type === 'checklist') {
        const result = await paudAssessmentAiService.generateChecklist(user, {
          studentName,
          className,
          theme: data.theme,
          learningObjective: data.learningObjective,
          targetIndicators: data.targetIndicators,
          roughNotes: data.roughNotes,
        })
        return response.json({ success: true, result })
      }

      if (data.type === 'work_sample') {
        const result = await paudAssessmentAiService.generateWorkSample(user, {
          studentName,
          className,
          theme: data.theme,
          workTitle: data.workTitle || 'Karya Anak',
          childQuotesOrDescription: data.childQuotesOrDescription,
        })
        return response.json({ success: true, result })
      }

      if (data.type === 'photo_series') {
        const result = await paudAssessmentAiService.generatePhotoSeries(user, {
          studentName,
          className,
          theme: data.theme,
          activityTitle: data.activityTitle || 'Kegiatan Eksplorasi',
          stageNotes: data.stageNotes,
        })
        return response.json({ success: true, result })
      }

      return response.badRequest({ error: 'Jenis asesmen tidak valid' })
    } catch (error) {
      return response.badRequest({
        error: error instanceof Error ? error.message : 'Gagal menghasilkan analisis AI',
      })
    }
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await this.findOwnedAssessment(params.id, user.id)
    if (!assessment) return response.redirect('/paud-assessments')

    const c = parseAssessmentContent(assessment)
    const theme = c.theme || assessment.activity || 'Asesmen'
    const studentName = assessment.student?.fullName || 'Siswa'
    const className = assessment.schoolClass?.name
      ? `Kelompok_${assessment.schoolClass.name}`
      : 'Kelompok_B'
    const typeLabel = TYPE_LABELS[assessment.type]?.replace(/\s+/g, '_') || 'Asesmen'
    const dateStr = assessment.date ? assessment.date.toISODate() : '2026-08-16'

    const buffer = await exportPaudAssessment(assessment, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Asesmen', typeLabel, className, theme, studentName, dateStr], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const assessment = await this.findOwnedAssessment(params.id, user.id)
    if (!assessment) return response.redirect('/paud-assessments')

    const c = parseAssessmentContent(assessment)
    const theme = c.theme || assessment.activity || 'Asesmen'
    const studentName = assessment.student?.fullName || 'Siswa'
    const className = assessment.schoolClass?.name
      ? `Kelompok_${assessment.schoolClass.name}`
      : 'Kelompok_B'
    const typeLabel = TYPE_LABELS[assessment.type]?.replace(/\s+/g, '_') || 'Asesmen'
    const dateStr = assessment.date ? assessment.date.toISODate() : '2026-08-16'

    const buffer = await exportPaudAssessmentPdf(assessment, user, !wantsInlinePreview(request))
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Asesmen', typeLabel, className, theme, studentName, dateStr], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
  }

  async exportBundle({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const filters = await request.validateUsing(exportBundlePaudAssessmentValidator)

    const query = PaudAssessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (q) => q.orderBy('display_order'))
      .orderBy('date', 'desc')

    if (filters.classId) query.where('class_id', filters.classId)
    if (filters.studentId) query.where('student_id', filters.studentId)
    if (filters.type && filters.type !== 'all') query.where('type', filters.type)

    const assessments = await query
    if (assessments.length === 0) {
      return response.redirect().back()
    }

    const first = assessments[0]
    const className = first.schoolClass?.name ? `Kelompok_${first.schoolClass.name}` : 'Kelompok_B'
    const themeTitle = filters.theme || 'Kenalkan'
    const week = filters.week ? `Minggu_${filters.week}` : 'Smt1'

    const buffer = await exportPaudAssessmentBundle(assessments, user, themeTitle)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Dokumen_Asesmen_RA', className, week, themeTitle], 'docx')
    )
  }

  async exportBundlePdf({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const filters = await request.validateUsing(exportBundlePaudAssessmentValidator)

    const query = PaudAssessment.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .preload('student')
      .preload('attachments', (q) => q.orderBy('display_order'))
      .orderBy('date', 'desc')

    if (filters.classId) query.where('class_id', filters.classId)
    if (filters.studentId) query.where('student_id', filters.studentId)
    if (filters.type && filters.type !== 'all') query.where('type', filters.type)

    const assessments = await query
    if (assessments.length === 0) {
      return response.redirect().back()
    }

    const first = assessments[0]
    const className = first.schoolClass?.name ? `Kelompok_${first.schoolClass.name}` : 'Kelompok_B'
    const themeTitle = filters.theme || 'Kenalkan'
    const week = filters.week ? `Minggu_${filters.week}` : 'Smt1'

    const buffer = await exportPaudAssessmentBundlePdf(
      assessments,
      user,
      themeTitle,
      !wantsInlinePreview(request)
    )
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Dokumen_Asesmen_RA', className, week, themeTitle], 'pdf'),
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
