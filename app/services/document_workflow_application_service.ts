import type { DocumentStatus, DocumentType } from '#models/document_workflow'
import { documentRepository } from '#repositories/document_repository'
import type { DocumentRepository } from '#repositories/document_repository'
import { auditService } from '#services/audit_service'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'

const TYPES: DocumentType[] = ['teaching_module', 'rppm', 'rpph', 'lkpd', 'media_module']

export type DocumentAutosavePayload = {
  content?: Record<string, unknown>
  status?: DocumentStatus
  templateKey?: string | null
}

export type DocumentStatusResult =
  | { kind: 'invalid_status'; message: string }
  | { kind: 'updated'; status: DocumentStatus; lastSavedAt: unknown }

export class DocumentWorkflowApplicationService {
  constructor(private readonly repository: DocumentRepository = documentRepository) {}

  async autosave(
    userId: number,
    typeValue: string,
    documentId: string | number,
    payload: DocumentAutosavePayload
  ) {
    const type = this.type(typeValue)
    const id = Number(documentId)
    const document = await this.repository.findDocument(type, id, userId)
    if (!document) return null

    if (payload.content && 'content' in document) {
      ;(document as { content: Record<string, unknown> }).content = payload.content
    }
    if (payload.status && 'status' in document && payload.status !== 'archived') {
      ;(document as { status: 'draft' | 'published' }).status = payload.status
    }
    await document.save()

    const workflow = await ensureDocumentWorkflow(userId, type, id, {
      templateKey: payload.templateKey ?? null,
    })
    if (payload.templateKey !== undefined) workflow.templateKey = payload.templateKey
    await saveDocumentWorkflow(workflow, payload.status)
    await auditService.record({
      actorId: userId,
      action: 'document.autosave',
      entityType: type,
      entityId: String(documentId),
      metadata: { version: workflow.version },
    })

    return {
      savedAt: workflow.lastSavedAt,
      version: workflow.version,
      status: workflow.status,
    }
  }

  async updateStatus(
    userId: number,
    typeValue: string,
    documentId: string | number,
    statusValue?: string,
    templateKey?: string | null
  ): Promise<DocumentStatusResult | null> {
    const type = this.type(typeValue)
    const id = Number(documentId)
    const document = await this.repository.findDocument(type, id, userId)
    if (!document) return null

    const workflow = await ensureDocumentWorkflow(userId, type, id)
    const status = (statusValue || workflow.status) as DocumentStatus
    if (!['draft', 'published', 'archived'].includes(status)) {
      return { kind: 'invalid_status', message: 'Status dokumen tidak valid' }
    }

    if (status !== 'archived' && 'status' in document) {
      ;(document as { status: 'draft' | 'published' }).status = status
    }
    await document.save()
    if (templateKey !== undefined) workflow.templateKey = templateKey
    await saveDocumentWorkflow(workflow, status)
    await auditService.record({
      actorId: userId,
      action: `document.${status}`,
      entityType: type,
      entityId: String(documentId),
    })

    return { kind: 'updated', status: workflow.status, lastSavedAt: workflow.lastSavedAt }
  }

  async duplicate(userId: number, typeValue: string, documentId: string | number) {
    const type = this.type(typeValue)
    const id = Number(documentId)
    const document = await this.repository.findDocument(type, id, userId)
    if (!document) return null

    const copy = await this.repository.clone(type, document, userId)
    const sourceWorkflow = await ensureDocumentWorkflow(userId, type, id)
    await ensureDocumentWorkflow(userId, type, copy.id, {
      status: 'draft',
      templateKey: sourceWorkflow.templateKey,
    })
    await auditService.record({
      actorId: userId,
      action: 'document.duplicate',
      entityType: type,
      entityId: String(copy.id),
      metadata: { sourceId: String(documentId) },
    })

    return { path: this.showPath(type, copy.id) }
  }

  private type(value: string): DocumentType {
    if (!TYPES.includes(value as DocumentType)) throw new Error('Unsupported document type')
    return value as DocumentType
  }

  private showPath(type: DocumentType, id: number) {
    return type === 'teaching_module'
      ? `/teaching-modules/${id}`
      : type === 'rppm'
        ? `/rppm/${id}`
        : type === 'rpph'
          ? `/rpph/${id}`
          : type === 'lkpd'
            ? `/lkpd/${id}`
            : `/media-modules/${id}`
  }
}

export const documentWorkflowApplicationService = new DocumentWorkflowApplicationService()
