import AssessmentAttachment from '#models/assessment_attachment'

export class AssessmentAttachmentRepository {
  async findForUser(attachmentId: string | number, userId: number, assessmentId: string | number) {
    return AssessmentAttachment.query()
      .where('id', attachmentId)
      .where('user_id', userId)
      .where('assessment_id', assessmentId)
      .first()
  }
}

export const assessmentAttachmentRepository = new AssessmentAttachmentRepository()
