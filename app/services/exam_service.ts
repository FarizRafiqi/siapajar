import Exam from '#models/exam'
import type User from '#models/user'
import { examRepository } from '#repositories/exam_repository'
import type { ExamRepository } from '#repositories/exam_repository'
import { exportExam } from '#services/export_service'
import { exportExamPdf } from '#services/pdf_export_service'
import { renderExamWorksheetHtml } from '#services/exam_worksheet_service'
import GenerateExam from '#jobs/generate_exam'
import { persistUploadedVisualAsset } from '#services/visual_asset_service'
import { exportFilename } from '#services/export_file_service'

const EXAM_TYPE_LABELS: Record<ExamGenerationData['type'], string> = {
  midterm: 'PTS',
  final: 'PAS',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

export type ExamUploadFile = {
  filePath: string
  mimeType: string | null | undefined
  originalName?: string | null
}

export type ExamGenerationData = {
  classId: number
  subject: string
  type: 'midterm' | 'final' | 'daily' | 'summative'
  topic: string
  questionCount: number
  examMode?: 'lisan' | 'tertulis_visual' | 'multiple_choice' | 'essay' | 'practical'
  learningSequenceId?: number
}

export type ExamGenerationResult =
  | { status: 'missing_class' }
  | { status: 'queue_unavailable'; examId: number }
  | { status: 'queued'; exam: Exam }

export class ExamService {
  constructor(private readonly repository: ExamRepository = examRepository) {}

  async getIndexData(user: User) {
    const { exams, classes, subjects } = await this.repository.getIndexData(
      user.id,
      user.educationLevel
    )

    return {
      exams: exams.map((exam) => exam.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
    }
  }

  async getShowData(userId: number, examId: string | number) {
    const exam = await this.repository.findForUser(examId, userId, true)
    return exam ? { exam: exam.toJSON() } : null
  }

  async getGenerationStatus(userId: number, examId: string | number) {
    const exam = await this.repository.findForUser(examId, userId)
    if (!exam) return null

    return {
      examId: exam.id,
      status: exam.generationStatus,
      progress: exam.generationProgress,
      questionCount: Array.isArray(exam.questions) ? exam.questions.length : 0,
    }
  }

  async findOwnedExam(userId: number, examId: string | number) {
    return this.repository.findForUser(examId, userId)
  }

  async persistImage(user: User, file: ExamUploadFile) {
    return persistUploadedVisualAsset({
      user,
      filePath: file.filePath,
      mimeType: file.mimeType,
      originalName: file.originalName,
    })
  }

  async getDocxExport(user: User, examId: string | number) {
    const exam = await this.repository.findForUser(examId, user.id)
    if (!exam) return null

    const buffer = await exportExam(exam, user)
    const safeTitle = exam.title.replaceAll(/[^\w\s-]/gi, '').replaceAll(/\s+/g, '_')

    return {
      buffer,
      filename: `Naskah_Soal_${safeTitle || 'RA_TK'}.docx`,
    }
  }

  async getPdfExport(user: User, examId: string | number, inline: boolean | undefined) {
    const exam = await this.repository.findForUser(examId, user.id)
    if (!exam) return null

    const buffer = await exportExamPdf(exam, user, !inline)
    return {
      buffer,
      filename: exportFilename(['Naskah Soal', exam.title], 'pdf'),
    }
  }

  async getPrintPreview(user: User, examId: string | number) {
    const exam = await this.repository.findForUser(examId, user.id)
    return exam ? renderExamWorksheetHtml(exam, user) : null
  }

  async create(user: User, data: Record<string, any>) {
    return Exam.create({
      ...data,
      userId: user.id,
      status: 'draft',
      header: data.header ?? {},
    })
  }

  async update(exam: Exam, data: Record<string, any>) {
    await exam.merge(data).save()
  }

  async destroy(exam: Exam) {
    await exam.delete()
  }

  async generate(user: User, data: ExamGenerationData): Promise<ExamGenerationResult> {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    const exam = await Exam.create({
      userId: user.id,
      classId: data.classId,
      title: EXAM_TYPE_LABELS[data.type] + ' ' + data.subject + ' - ' + data.topic,
      type: data.type,
      questions: [],
      header: {
        institutionName: user.schoolName || '',
        institutionAddress: '',
        academicYear: '',
        semester: '',
        groupName: schoolClass.name,
        subject: data.subject,
        examLabel: EXAM_TYPE_LABELS[data.type],
        studentName: '',
        date: '',
      },
      status: 'draft',
      generationStatus: 'queued',
      generationProgress: {
        stage: 'queued',
        current: 0,
        total: 0,
        message: 'Menunggu proses pembuatan naskah...',
        errors: [],
      },
    })

    try {
      await GenerateExam.dispatch({
        examId: exam.id,
        userId: user.id,
        classId: data.classId,
        subject: data.subject,
        type: data.type,
        topic: data.topic,
        questionCount: data.questionCount,
        examMode: data.examMode,
        learningSequenceId: data.learningSequenceId,
      }).dedup({ id: 'exam-generation-' + exam.id, ttl: '15m' })
    } catch (error) {
      exam.generationStatus = 'failed'
      exam.generationProgress = {
        stage: 'failed',
        current: 0,
        total: 0,
        message: 'Pembuatan naskah gagal dimulai.',
        errors: [
          {
            stage: 'queued',
            message: error instanceof Error ? error.message : 'Antrean AI tidak tersedia.',
          },
        ],
      }
      await exam.save()
      return { status: 'queue_unavailable', examId: exam.id }
    }

    return { status: 'queued', exam }
  }
}

export const examService = new ExamService()
