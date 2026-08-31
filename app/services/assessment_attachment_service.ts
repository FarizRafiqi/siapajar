import { readFile, stat } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { assessmentAttachmentRepository } from '#repositories/assessment_attachment_repository'
import type { AssessmentAttachmentRepository } from '#repositories/assessment_attachment_repository'
import { exportFilename } from '#services/export_file_service'

const PREVIEWABLE_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
const SAFE_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])

export type AssessmentAttachmentFileResult =
  | { status: 'attachment_not_found' }
  | { status: 'file_not_found' }
  | {
      status: 'found'
      buffer: Buffer
      mimeType: string
      filename: string
      inline: boolean
    }

export class AssessmentAttachmentService {
  constructor(
    private readonly repository: AssessmentAttachmentRepository = assessmentAttachmentRepository
  ) {}

  async getFile(
    userId: number,
    assessmentId: string | number,
    attachmentId: string | number,
    inlineRequested: boolean
  ): Promise<AssessmentAttachmentFileResult> {
    const attachment = await this.repository.findForUser(attachmentId, userId, assessmentId)
    if (!attachment) return { status: 'attachment_not_found' }

    const storageRoot = resolve(process.cwd(), 'public', 'uploads', 'assessments')
    const filePath = resolve(
      storageRoot,
      String(attachment.userId),
      String(attachment.assessmentId),
      basename(attachment.storedName)
    )

    if (!filePath.startsWith(`${storageRoot}/`)) {
      return { status: 'file_not_found' }
    }

    try {
      await stat(filePath)
      const buffer = await readFile(filePath)
      const mimeType = SAFE_MIME_TYPES.has(attachment.mimeType)
        ? attachment.mimeType
        : 'application/octet-stream'
      const extension = mimeType === 'application/pdf' ? 'pdf' : mimeType.split('/')[1] || 'bin'

      return {
        status: 'found',
        buffer,
        mimeType,
        filename: exportFilename([attachment.originalName], extension),
        inline: inlineRequested && PREVIEWABLE_TYPES.has(mimeType),
      }
    } catch {
      return { status: 'file_not_found' }
    }
  }
}

export const assessmentAttachmentService = new AssessmentAttachmentService()
