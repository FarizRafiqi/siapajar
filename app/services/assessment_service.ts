import { assessmentRepository } from '#repositories/assessment_repository'
import type { AssessmentRepository } from '#repositories/assessment_repository'

export class AssessmentService {
  constructor(private readonly repository: AssessmentRepository = assessmentRepository) {}

  async getIndexData(userId: number, educationLevel?: string) {
    return this.repository.getIndexData(userId, educationLevel ?? 'sd')
  }

  async createAssessment(
    userId: number,
    data: {
      classId: number
      semesterId?: number | null
      subject: string
      type: 'formative' | 'summative'
      title: string
      learningObjective?: string | null
      date: any
    }
  ) {
    const schoolClass = await this.repository.findOwnedClass(data.classId, userId)
    if (!schoolClass) {
      return { status: 'class_not_found' as const }
    }

    let semesterId = data.semesterId ?? null
    if (!semesterId) {
      const activeSemester = await this.repository.findActiveSemester(schoolClass.academicYearId)
      semesterId = activeSemester?.id ?? null
    }

    const assessment = await this.repository.createWithInitialScores({
      userId,
      classId: data.classId,
      semesterId,
      subject: data.subject,
      type: data.type,
      title: data.title,
      learningObjective: data.learningObjective ?? null,
      date: data.date,
    })

    return { status: 'success' as const, assessment }
  }

  async findForUser(id: string | number, userId: number, withRelations = false) {
    return this.repository.findForUser(id, userId, withRelations)
  }

  async updateScores(
    id: string | number,
    userId: number,
    scores: Array<{ studentId: number; value: number | null; note?: string | null }>
  ) {
    const assessment = await this.repository.findForUser(id, userId)
    if (!assessment) {
      return false
    }

    await this.repository.updateScores(id, scores)
    return true
  }

  async deleteAssessment(id: string | number, userId: number) {
    const assessment = await this.repository.findForUser(id, userId)
    if (!assessment) {
      return false
    }

    await assessment.delete()
    return true
  }
}

export const assessmentService = new AssessmentService()
