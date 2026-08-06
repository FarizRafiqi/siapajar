import type { HttpContext } from '@adonisjs/core/http'
import { readFile, stat } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import AssessmentAttachment from '#models/assessment_attachment'
import { exportFilename, sendExport } from '#services/export_file_service'

const PREVIEWABLE_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
const SAFE_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])

export default class AssessmentAttachmentsController {
  async show({ params, response, auth, request }: HttpContext) {
    const attachment = await AssessmentAttachment.query()
      .where('id', params.attachmentId)
      .where('user_id', auth.user!.id)
      .where('assessment_id', params.id)
      .first()

    if (!attachment) return response.notFound({ message: 'Lampiran tidak ditemukan' })

    const storageRoot = resolve(process.cwd(), 'public', 'uploads', 'assessments')
    const filePath = resolve(
      storageRoot,
      String(attachment.userId),
      String(attachment.assessmentId),
      basename(attachment.storedName)
    )

    if (!filePath.startsWith(`${storageRoot}/`)) {
      return response.notFound({ message: 'Berkas lampiran tidak ditemukan' })
    }

    try {
      await stat(filePath)
      const buffer = await readFile(filePath)
      const mimeType = SAFE_MIME_TYPES.has(attachment.mimeType)
        ? attachment.mimeType
        : 'application/octet-stream'
      const extension = mimeType === 'application/pdf' ? 'pdf' : mimeType.split('/')[1] || 'bin'
      const inline = request.input('disposition') === 'inline' && PREVIEWABLE_TYPES.has(mimeType)
      return sendExport(
        response,
        buffer,
        mimeType,
        exportFilename([attachment.originalName], extension),
        { inline }
      )
    } catch {
      return response.notFound({ message: 'Berkas lampiran tidak ditemukan' })
    }
  }
}
