import { assessmentAttachmentRepository } from '#repositories/assessment_attachment_repository'
import type { AssessmentAttachmentRepository } from '#repositories/assessment_attachment_repository'

export class AssessmentAttachmentService {
  constructor(
    private readonly repository: AssessmentAttachmentRepository = assessmentAttachmentRepository
  ) {}

  async findForUser(attachmentId: string | number, userId: number, assessmentId?: string | number) {
    return this.repository.findForUser(attachmentId, userId, assessmentId)
  }
}

export const assessmentAttachmentService = new AssessmentAttachmentService()
