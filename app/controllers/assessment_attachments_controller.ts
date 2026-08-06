import type { HttpContext } from '@adonisjs/core/http'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import AssessmentAttachment from '#models/assessment_attachment'
import { exportFilename, sendExport } from '#services/export_file_service'

const PREVIEWABLE_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])

export default class AssessmentAttachmentsController {
  async show({ params, response, auth, request }: HttpContext) {
    const attachment = await AssessmentAttachment.query()
      .where('id', params.attachmentId)
      .where('user_id', auth.user!.id)
      .where('assessment_id', params.id)
      .first()

    if (!attachment) return response.notFound({ message: 'Lampiran tidak ditemukan' })

    const filePath = join(
      process.cwd(),
      'public',
      'uploads',
      'assessments',
      String(attachment.userId),
      String(attachment.assessmentId),
      attachment.storedName
    )

    try {
      await stat(filePath)
      const buffer = await readFile(filePath)
      const extension = attachment.originalName.split('.').pop() || 'bin'
      const inline =
        request.input('disposition') === 'inline' && PREVIEWABLE_TYPES.has(attachment.mimeType)
      return sendExport(
        response,
        buffer,
        attachment.mimeType,
        exportFilename([attachment.originalName.replace(/\.[^.]+$/, '')], extension),
        { inline }
      )
    } catch {
      return response.notFound({ message: 'Berkas lampiran tidak ditemukan' })
    }
  }
}
