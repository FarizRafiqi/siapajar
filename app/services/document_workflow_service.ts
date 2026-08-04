import DocumentWorkflow, { type DocumentStatus, type DocumentType } from '#models/document_workflow'
import { DateTime } from 'luxon'

export async function ensureDocumentWorkflow(userId: number, documentType: DocumentType, documentId: number, defaults?: Partial<{ status: DocumentStatus; templateKey: string | null }>) {
  return DocumentWorkflow.firstOrCreate(
    { userId, documentType, documentId },
    { userId, documentType, documentId, status: defaults?.status ?? 'draft', lastSavedAt: DateTime.now(), templateKey: defaults?.templateKey ?? null, version: 1 }
  )
}

export async function saveDocumentWorkflow(workflow: DocumentWorkflow, status?: DocumentStatus) {
  workflow.status = status ?? workflow.status
  workflow.lastSavedAt = DateTime.now()
  workflow.version += 1
  await workflow.save()
  return workflow
}
