import type { HttpContext } from '@adonisjs/core/http'
import TeachingModule from '#models/teaching_module'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import DailyLessonPlan from '#models/daily_lesson_plan'
import Lkpd from '#models/lkpd'
import MediaModule from '#models/media_module'
import { type DocumentStatus, type DocumentType } from '#models/document_workflow'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import { auditService } from '#services/audit_service'

const TYPES: DocumentType[] = ['teaching_module', 'rppm', 'rpph', 'lkpd', 'media_module']

export default class DocumentWorkflowsController {
  async autosave({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const type = this.type(params.type)
    const document = await this.findDocument(type, Number(params.id), user.id)
    if (!document) return response.notFound({ message: 'Dokumen tidak ditemukan' })
    const payload = request.only(['content', 'status', 'templateKey']) as {
      content?: Record<string, unknown>
      status?: DocumentStatus
      templateKey?: string | null
    }
    if (payload.content && 'content' in document)
      (document as { content: Record<string, unknown> }).content = payload.content
    if (payload.status && 'status' in document && payload.status !== 'archived')
      (document as { status: 'draft' | 'published' }).status = payload.status
    await document.save()
    const workflow = await ensureDocumentWorkflow(user.id, type, Number(params.id), {
      templateKey: payload.templateKey ?? null,
    })
    if (payload.templateKey !== undefined) workflow.templateKey = payload.templateKey
    await saveDocumentWorkflow(workflow, payload.status)
    await auditService.record({
      actorId: user.id,
      action: 'document.autosave',
      entityType: type,
      entityId: params.id,
      metadata: { version: workflow.version },
    })
    return response.ok({
      savedAt: workflow.lastSavedAt,
      version: workflow.version,
      status: workflow.status,
    })
  }

  async status({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const type = this.type(params.type)
    const document = await this.findDocument(type, Number(params.id), user.id)
    if (!document) return response.notFound({ message: 'Dokumen tidak ditemukan' })
    const workflow = await ensureDocumentWorkflow(user.id, type, Number(params.id))
    const status = (request.input('status') || workflow.status) as DocumentStatus
    const templateKey = request.input('templateKey') as string | null | undefined
    if (!['draft', 'published', 'archived'].includes(status))
      return response.badRequest({ message: 'Status dokumen tidak valid' })
    if (status !== 'archived' && 'status' in document)
      (document as { status: 'draft' | 'published' }).status = status
    await document.save()
    if (templateKey !== undefined) workflow.templateKey = templateKey
    await saveDocumentWorkflow(workflow, status)
    await auditService.record({
      actorId: user.id,
      action: `document.${status}`,
      entityType: type,
      entityId: params.id,
    })
    return response.ok({ status: workflow.status, lastSavedAt: workflow.lastSavedAt })
  }

  async duplicate({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const type = this.type(params.type)
    const document = await this.findDocument(type, Number(params.id), user.id)
    if (!document) return response.notFound({ message: 'Dokumen tidak ditemukan' })
    const copy = await this.clone(type, document, user.id)
    const sourceWorkflow = await ensureDocumentWorkflow(user.id, type, Number(params.id))
    await ensureDocumentWorkflow(user.id, type, copy.id, {
      status: 'draft',
      templateKey: sourceWorkflow.templateKey,
    })
    await auditService.record({
      actorId: user.id,
      action: 'document.duplicate',
      entityType: type,
      entityId: copy.id,
      metadata: { sourceId: params.id },
    })
    return response.redirect(this.showPath(type, copy.id))
  }

  private type(value: string): DocumentType {
    if (!TYPES.includes(value as DocumentType)) throw new Error('Unsupported document type')
    return value as DocumentType
  }

  private async findDocument(type: DocumentType, id: number, userId: number): Promise<any | null> {
    const model =
      type === 'teaching_module'
        ? TeachingModule
        : type === 'rppm'
          ? WeeklyLessonPlan
          : type === 'rpph'
            ? DailyLessonPlan
            : type === 'lkpd'
              ? Lkpd
              : MediaModule
    return model.query().where('id', id).where('user_id', userId).first()
  }

  private async clone(type: DocumentType, source: any, userId: number): Promise<any> {
    if (type === 'teaching_module')
      return TeachingModule.create({
        userId,
        classId: source.classId,
        title: `${source.title} (Copy)`,
        subject: source.subject,
        phase: source.phase,
        content: source.content ?? {},
        status: 'draft',
      })
    if (type === 'rppm')
      return WeeklyLessonPlan.create({
        userId,
        classId: source.classId,
        theme: `${source.theme} (Copy)`,
        weekStartDate: source.weekStartDate,
        content: source.content ?? {},
        status: 'draft',
      })
    if (type === 'rpph')
      return DailyLessonPlan.create({
        userId,
        classId: source.classId,
        weeklyLessonPlanId: source.weeklyLessonPlanId,
        date: source.date,
        content: source.content ?? {},
        status: 'draft',
      })
    if (type === 'lkpd')
      return Lkpd.create({
        userId,
        classId: source.classId,
        title: `${source.title} (Copy)`,
        theme: source.theme,
        subtheme: source.subtheme,
        ageGroup: source.ageGroup,
        institutionType: source.institutionType,
        content: source.content ?? {},
        status: 'draft',
      })
    return MediaModule.create({
      userId,
      classId: source.classId,
      title: `${source.title} (Copy)`,
      theme: source.theme,
      subtheme: source.subtheme,
      slides: source.slides ?? [],
      loosePartsGuide: source.loosePartsGuide ?? null,
      status: 'draft',
    })
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
