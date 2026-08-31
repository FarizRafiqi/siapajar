import type User from '#models/user'
import { assessmentRepository } from '#repositories/assessment_repository'
import type {
  AssessmentRepository,
  AssessmentScoreUpdate,
} from '#repositories/assessment_repository'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { exportAssessmentScores } from '#services/xlsx_export_service'
import { exportAssessment as exportAssessmentDocx } from '#services/export_service'
import { exportAssessmentPdf } from '#services/pdf_export_service'

export class AssessmentService {
  constructor(private readonly repository: AssessmentRepository = assessmentRepository) {}

  async getIndexData(user: User) {
    const { assessments, classes, subjects } = await this.repository.getIndexData(
      user.id,
      user.educationLevel
    )

    return {
      assessments: assessments.map((assessment) => assessment.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
    }
  }

  async create(user: User, data: Record<string, any>) {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return null

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await this.repository.findActiveSemester(schoolClass.academicYearId)
      semesterId = activeSemester?.id ?? null
    }

    return this.repository.createWithInitialScores(
      {
        userId: user.id,
        classId: data.classId,
        semesterId,
        subject: data.subject,
        type: data.type,
        title: data.title,
        learningObjective: data.learningObjective ?? null,
        date: data.date,
      },
      data.classId
    )
  }

  async getShowData(userId: number, assessmentId: string | number) {
    const assessment = await this.repository.findForUser(assessmentId, userId, true)
    return assessment ? { assessment: assessment.toJSON() } : null
  }

  async getExportData(
    user: User,
    assessmentId: string | number,
    format: 'xlsx' | 'docx' | 'pdf',
    charge = true
  ) {
    const assessment = await this.repository.findForUser(assessmentId, user.id, true)
    if (!assessment) return null

    let buffer: Buffer
    if (format === 'xlsx') {
      await assertEntitled(user, 'export_xlsx')
      await recordUsage(user.id, 'export_xlsx')
      buffer = exportAssessmentScores(assessment, user)
    } else if (format === 'docx') {
      buffer = await exportAssessmentDocx(assessment, user)
    } else {
      buffer = await exportAssessmentPdf(assessment, user, charge)
    }

    return { assessment, buffer }
  }

  async exists(userId: number, assessmentId: string | number) {
    return Boolean(await this.repository.findForUser(assessmentId, userId))
  }

  async updateScores(
    userId: number,
    assessmentId: string | number,
    scores: AssessmentScoreUpdate[]
  ) {
    const assessment = await this.repository.findForUser(assessmentId, userId)
    if (!assessment) return false

    await this.repository.updateScores(assessment.id, scores)
    return true
  }

  async destroy(userId: number, assessmentId: string | number) {
    const assessment = await this.repository.findForUser(assessmentId, userId)
    if (!assessment) return false

    await assessment.delete()
    return true
  }
}

export const assessmentService = new AssessmentService()
