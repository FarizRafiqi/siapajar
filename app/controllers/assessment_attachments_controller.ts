import type { HttpContext } from '@adonisjs/core/http'
import { assessmentAttachmentService } from '#services/assessment_attachment_service'
import { sendExport } from '#services/export_file_service'

export default class AssessmentAttachmentsController {
  async show({ params, response, auth, request }: HttpContext) {
    const result = await assessmentAttachmentService.getFile(
      auth.user!.id,
      params.id,
      params.attachmentId,
      request.input('disposition') === 'inline'
    )

    if (result.status === 'attachment_not_found') {
      return response.notFound({ message: 'Lampiran tidak ditemukan' })
    }

    if (result.status === 'file_not_found') {
      return response.notFound({ message: 'Berkas lampiran tidak ditemukan' })
    }

    return sendExport(response, result.buffer, result.mimeType, result.filename, {
      inline: result.inline,
    })
  }
}
