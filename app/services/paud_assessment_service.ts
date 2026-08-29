import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'
import { randomUUID } from 'node:crypto'
import { mkdir, rm, unlink } from 'node:fs/promises'
import { DateTime } from 'luxon'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import { paudAssessmentRepository } from '#repositories/paud_assessment_repository'
import type {
  PaudAssessmentBundleFilters,
  PaudAssessmentRepository,
  PaudAssessmentType,
  PersistedPaudAttachment,
} from '#repositories/paud_assessment_repository'
import { auditService } from '#services/audit_service'
import { exportPaudAssessment, exportPaudAssessmentBundle } from '#services/export_service'
import {
  exportPaudAssessmentBundlePdf,
  exportPaudAssessmentPdf,
} from '#services/pdf_export_service'
import { paudAssessmentAiService } from '#services/paud_assessment_ai_service'
import { parseAssessmentContent } from '#services/paud_assessment_export_service'
import { exportFilename } from '#services/export_file_service'

const ATTACHMENT_EXTENSIONS: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

export const PAUD_ASSESSMENT_TYPE_LABELS: Record<string, string> = {
  checklist: 'Ceklis IKTP',
  anecdotal_note: 'Catatan Anekdot',
  work_sample: 'Hasil Karya',
  photo_series: 'Foto Berseri',
}

export type PaudAssessmentCreateResult =
  | { status: 'missing_class' }
  | { status: 'missing_student' }
  | { status: 'invalid_learning_objective' }
  | { status: 'created'; assessmentId: number; typeLabel: string }

export type QuickCaptureResult =
  { status: 'empty' } | { status: 'created'; assessmentIds: string[] }

export type GenerateAiResult =
  | { status: 'success'; result: unknown }
  | { status: 'invalid_type' }
  | { status: 'error'; error: string }

export type PaudAssessmentExportResult = {
  buffer: Buffer
  filename: string
}

export class PaudAssessmentService {
  constructor(private readonly repository: PaudAssessmentRepository = paudAssessmentRepository) {}

  async resolveUser(authorizationHeader: string | undefined, fallbackUser: User | null) {
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.substring(7)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8')
        const [userId] = decoded.split(':')
        if (userId) return User.find(userId)
      } catch {}
    }

    return fallbackUser
  }

  async getIndexData(user: User, apiResponse = false) {
    const { assessments, classes, curriculumObjectives } = await this.repository.getIndexData(
      user.id,
      !apiResponse
    )

    if (apiResponse) {
      return assessments.map((assessment) => ({
        ...assessment.toJSON(),
        attachments: assessment.attachments.map((attachment) => ({
          ...attachment.toJSON(),
          url: `/storage/assessments/${attachment.storedName}`,
        })),
      }))
    }

    return {
      assessments: assessments.map((assessment) => ({
        ...assessment.toJSON(),
        attachments: assessment.attachments.map((attachment) => ({
          ...attachment.toJSON(),
          url: `/paud-assessments/${assessment.id}/attachments/${attachment.id}`,
        })),
      })),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      typeLabels: PAUD_ASSESSMENT_TYPE_LABELS,
      curriculumObjectives: curriculumObjectives.map((objective) => objective.toJSON()),
    }
  }

  async getStudentTimeline(studentId: string | number) {
    const assessments = await this.repository.findTimeline(studentId)

    return assessments.map((assessment) => {
      const weekNum = Number(assessment.content?.weekNumber) || 2
      const semNum = Number(assessment.content?.semesterNumber) || 1
      const tpLabel = assessment.learningObjective
        ? `${assessment.learningObjective.code} - ${assessment.learningObjective.title}`
        : assessment.learningObjectiveId
          ? `TP ${assessment.learningObjectiveId}`
          : 'TP 1.3 - Capaian Pembelajaran'

      return {
        id: String(assessment.id),
        instrumentType: assessment.type,
        instrumentTitle: PAUD_ASSESSMENT_TYPE_LABELS[assessment.type] || 'Asesmen',
        date: assessment.date.toISODate(),
        dateText: assessment.date.toFormat('dd MMMM yyyy'),
        activity: assessment.activity,
        notes: assessment.teacherNote,
        achievementStatus: assessment.achievementStatus,
        tpCode: tpLabel,
        weekNumber: weekNum,
        semesterNumber: semNum,
        attachments: assessment.attachments.map((attachment) => ({
          id: String(attachment.id),
          fileName: attachment.originalName,
          url: attachment.url || `/storage/assessments/${attachment.storedName}`,
        })),
      }
    })
  }

  async quickCapture(user: User, request: HttpContext['request']): Promise<QuickCaptureResult> {
    const { classId, studentIds, instrumentType, notes, activity, date } = request.all()
    const parsedStudentIds = Array.isArray(studentIds)
      ? studentIds
      : typeof studentIds === 'string'
        ? studentIds.split(',').map((id: string) => id.trim())
        : []

    if (parsedStudentIds.length === 0) return { status: 'empty' }

    const typeMapping: Record<string, PaudAssessmentType> = {
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
    const photoFile = request.file('photo', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let attachment:
      | {
          originalName: string
          storedName: string
          size: number
          mimeType: string
        }
      | undefined

    if (photoFile && photoFile.isValid) {
      const storedName = `${randomUUID()}.${photoFile.extname}`
      const uploadDirectory = app.makePath('storage/uploads/assessments')
      await mkdir(uploadDirectory, { recursive: true })
      await photoFile.move(uploadDirectory, { name: storedName })
      attachment = {
        originalName: photoFile.clientName || 'Foto Asesmen',
        storedName,
        size: photoFile.size || 0,
        mimeType: photoFile.type || 'image/jpeg',
      }
    }

    const assessments = await this.repository.createQuickCapture({
      userId: user.id,
      classId: Number(classId) || 1,
      studentIds: parsedStudentIds.map((studentId: unknown) => Number(studentId)),
      type: resolvedType,
      activity: activity || 'Kegiatan Pembelajaran',
      teacherNote: notes || '',
      date: assessmentDate,
      attachment,
    })

    return {
      status: 'created',
      assessmentIds: assessments.map((assessment) => String(assessment.id)),
    }
  }

  async generateAi(user: User, data: Record<string, any>): Promise<GenerateAiResult> {
    let studentName = ''
    if (data.studentId) {
      const student = await Student.find(data.studentId)
      studentName = student?.fullName || ''
    }

    let className = ''
    if (data.classId) {
      const schoolClass = await SchoolClass.find(data.classId)
      className = schoolClass?.name ? `Kelompok ${schoolClass.name}` : ''
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
        return { status: 'success', result }
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
        return { status: 'success', result }
      }

      if (data.type === 'work_sample') {
        const result = await paudAssessmentAiService.generateWorkSample(user, {
          studentName,
          className,
          theme: data.theme,
          workTitle: data.workTitle || 'Karya Anak',
          childQuotesOrDescription: data.childQuotesOrDescription,
        })
        return { status: 'success', result }
      }

      if (data.type === 'photo_series') {
        const result = await paudAssessmentAiService.generatePhotoSeries(user, {
          studentName,
          className,
          theme: data.theme,
          activityTitle: data.activityTitle || 'Kegiatan Eksplorasi',
          stageNotes: data.stageNotes,
        })
        return { status: 'success', result }
      }

      return { status: 'invalid_type' }
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Gagal menghasilkan analisis AI',
      }
    }
  }

  async getExportData(
    user: User,
    assessmentId: string | number,
    format: 'docx' | 'pdf',
    inline = false
  ): Promise<PaudAssessmentExportResult | null> {
    const assessment = await this.repository.findOwnedAssessment(assessmentId, user.id, true)
    if (!assessment) return null

    const content = parseAssessmentContent(assessment)
    const theme = content.theme || assessment.activity || 'Asesmen'
    const studentName = assessment.student?.fullName || 'Siswa'
    const className = assessment.schoolClass?.name
      ? `Kelompok_${assessment.schoolClass.name}`
      : 'Kelompok_B'
    const typeLabel =
      PAUD_ASSESSMENT_TYPE_LABELS[assessment.type]?.replace(/\s+/g, '_') || 'Asesmen'
    const dateStr = assessment.date ? assessment.date.toISODate() : '2026-08-16'
    const filename = exportFilename(
      ['Asesmen', typeLabel, className, theme, studentName, dateStr],
      format
    )
    const buffer =
      format === 'docx'
        ? await exportPaudAssessment(assessment, user)
        : await exportPaudAssessmentPdf(assessment, user, !inline)

    return { buffer, filename }
  }

  async getBundleExportData(
    user: User,
    filters: PaudAssessmentBundleFilters,
    format: 'docx' | 'pdf',
    inline = false
  ): Promise<PaudAssessmentExportResult | null> {
    const assessments = await this.repository.findBundle(user.id, filters)
    if (assessments.length === 0) return null

    const first = assessments[0]
    const className = first.schoolClass?.name ? `Kelompok_${first.schoolClass.name}` : 'Kelompok_B'
    const themeTitle = filters.theme || 'Kenalkan'
    const week = filters.week ? `Minggu_${filters.week}` : 'Smt1'
    const buffer =
      format === 'docx'
        ? await exportPaudAssessmentBundle(assessments, user, themeTitle)
        : await exportPaudAssessmentBundlePdf(assessments, user, themeTitle, !inline)

    return {
      buffer,
      filename: exportFilename(['Dokumen_Asesmen_RA', className, week, themeTitle], format),
    }
  }

  async create(
    user: User,
    data: Record<string, any>,
    request: HttpContext['request']
  ): Promise<PaudAssessmentCreateResult> {
    const content =
      typeof data.content === 'string' ? JSON.parse(data.content) : (data.content ?? {})
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    const student = await this.repository.findStudentInClass(data.studentId, data.classId)
    if (!student) return { status: 'missing_student' }

    if (data.learningObjectiveId) {
      const objective = await this.repository.findAvailableLearningObjective(
        data.learningObjectiveId,
        user.id
      )
      if (!objective) return { status: 'invalid_learning_objective' }
    }

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await this.repository.findActiveSemester(schoolClass.academicYearId)
      semesterId = activeSemester?.id ?? null
    }

    const uploadedPaths: string[] = []
    try {
      const assessment = await this.repository.createWithAttachments(
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
        async (createdAssessment) => {
          const attachments: PersistedPaudAttachment[] = []
          if (!['work_sample', 'photo_series'].includes(data.type)) return attachments

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
            attachments.push({
              originalName: file.clientName,
              storedName,
              mimeType: ATTACHMENT_EXTENSIONS[extension],
              size: file.size,
              displayOrder: index,
            })
          }

          return attachments
        }
      )

      await auditService.record({
        actorId: user.id,
        action: 'assessment.create',
        entityType: 'paud_assessment',
        entityId: assessment.id,
        metadata: { type: data.type, attachmentCount: request.files('attachments').length },
      })

      return {
        status: 'created',
        assessmentId: assessment.id,
        typeLabel: PAUD_ASSESSMENT_TYPE_LABELS[data.type],
      }
    } catch (error) {
      await Promise.all(uploadedPaths.map((filePath) => unlink(filePath).catch(() => {})))
      throw error
    }
  }

  async update(userId: number, assessmentId: string | number, data: Record<string, any>) {
    const assessment = await this.repository.findOwnedAssessment(assessmentId, userId)
    if (!assessment) return false

    await assessment.merge(data).save()
    return true
  }

  async exists(userId: number, assessmentId: string | number) {
    return Boolean(await this.repository.findOwnedAssessment(assessmentId, userId))
  }

  async destroy(userId: number, assessmentId: string | number) {
    const deleted = await this.repository.deleteWithAttachments(assessmentId, userId)
    if (!deleted) return false

    const attachmentDirectory = `public/uploads/assessments/${userId}/${deleted.assessmentId}`
    const storedPaths = deleted.storedNames.map(
      (storedName) => `${attachmentDirectory}/${storedName}`
    )
    await Promise.all(storedPaths.map((filePath) => unlink(filePath).catch(() => {})))
    await rm(attachmentDirectory, { recursive: true, force: true })
    return true
  }
}

export const paudAssessmentService = new PaudAssessmentService()
