import AssessmentAttachment from '#models/assessment_attachment'

export class AssessmentAttachmentRepository {
  async findForUser(attachmentId: string | number, userId: number, assessmentId?: string | number) {
    const query = AssessmentAttachment.query().where('id', attachmentId).where('user_id', userId)

    if (assessmentId !== undefined) {
      query.where('assessment_id', assessmentId)
    }

    return query.first()
  }
}

export const assessmentAttachmentRepository = new AssessmentAttachmentRepository()
