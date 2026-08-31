import type { HttpContext } from '@adonisjs/core/http'
import type { DocumentAutosavePayload } from '#services/document_workflow_application_service'
import { documentWorkflowApplicationService } from '#services/document_workflow_application_service'

export default class DocumentWorkflowsController {
  async autosave({ params, request, response, auth }: HttpContext) {
    const payload = request.only(['content', 'status', 'templateKey']) as DocumentAutosavePayload
    const result = await documentWorkflowApplicationService.autosave(
      auth.user!.id,
      params.type,
      params.id,
      payload
    )

    if (!result) {
      return response.notFound({ message: 'Dokumen tidak ditemukan' })
    }

    return response.ok(result)
  }

  async status({ params, request, response, auth }: HttpContext) {
    const result = await documentWorkflowApplicationService.updateStatus(
      auth.user!.id,
      params.type,
      params.id,
      request.input('status'),
      request.input('templateKey')
    )

    if (!result) {
      return response.notFound({ message: 'Dokumen tidak ditemukan' })
    }

    if (result.kind === 'invalid_status') {
      return response.badRequest({ message: result.message })
    }

    return response.ok({ status: result.status, lastSavedAt: result.lastSavedAt })
  }

  async duplicate({ params, response, auth }: HttpContext) {
    const result = await documentWorkflowApplicationService.duplicate(
      auth.user!.id,
      params.type,
      params.id
    )

    if (!result) {
      return response.notFound({ message: 'Dokumen tidak ditemukan' })
    }

    return response.redirect(result.path)
  }
}
