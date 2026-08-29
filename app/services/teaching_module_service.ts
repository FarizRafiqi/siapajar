import TeachingModule from '#models/teaching_module'
import type User from '#models/user'
import { teachingModuleRepository } from '#repositories/teaching_module_repository'
import type { TeachingModuleRepository } from '#repositories/teaching_module_repository'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import { exportTeachingModule } from '#services/export_service'
import { exportTeachingModulePdf } from '#services/pdf_export_service'
import { AiServiceError, normalizeStringArraySections } from '#services/ai_service'
import { teachingModulePrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'

export type GenerateTeachingModuleData = {
  classId: number
  subject: string
  topic: string
  phase: string
  learningModel?: string
  learningApproach?: string
  learningSequenceId?: number
}

export type GenerateTeachingModuleResult =
  | { status: 'missing_class' }
  | { status: 'generation_error'; message: string }
  | { status: 'created'; teachingModule: TeachingModule }

export class TeachingModuleService {
  constructor(private readonly repository: TeachingModuleRepository = teachingModuleRepository) {}

  async getIndexData(user: User) {
    const { teachingModules, classes, subjects, sequences } = await this.repository.getIndexData(
      user.id,
      user.educationLevel
    )

    return {
      teachingModules: teachingModules.map((module) => module.toJSON()),
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }

  async getShowData(userId: number, moduleId: string | number) {
    const teachingModule = await this.repository.findForUser(moduleId, userId, true)
    if (!teachingModule) return null

    const workflow = await ensureDocumentWorkflow(userId, 'teaching_module', teachingModule.id, {
      status: teachingModule.status,
    })
    return {
      teachingModule: teachingModule.toJSON(),
      workflow: workflow.toJSON(),
    }
  }

  async getExportData(
    user: User,
    moduleId: string | number,
    format: 'docx' | 'pdf',
    charge = true
  ) {
    const teachingModule = await this.repository.findForUser(moduleId, user.id)
    if (!teachingModule) return null

    const buffer =
      format === 'docx'
        ? await exportTeachingModule(teachingModule, user)
        : await exportTeachingModulePdf(teachingModule, user, charge)
    return { teachingModule, buffer }
  }

  async exists(userId: number, moduleId: string | number) {
    return Boolean(await this.repository.findForUser(moduleId, userId))
  }

  async create(user: User, data: Record<string, any>) {
    return TeachingModule.create({ ...data, userId: user.id, status: 'draft' })
  }

  async update(userId: number, moduleId: string | number, data: Record<string, any>) {
    const teachingModule = await this.repository.findForUser(moduleId, userId)
    if (!teachingModule) return false

    await teachingModule.merge(data).save()
    const workflow = await ensureDocumentWorkflow(userId, 'teaching_module', teachingModule.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)
    return true
  }

  async destroy(userId: number, moduleId: string | number) {
    const teachingModule = await this.repository.findForUser(moduleId, userId)
    if (!teachingModule) return false

    await teachingModule.delete()
    return true
  }

  async generate(
    user: User,
    data: GenerateTeachingModuleData
  ): Promise<GenerateTeachingModuleResult> {
    const schoolClass = await this.repository.findOwnedClass(data.classId, user.id)
    if (!schoolClass) return { status: 'missing_class' }

    const curriculum = await getCurriculumContext(user.id, data.learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = teachingModulePrompt({
        subject: data.subject,
        topic: data.topic,
        phase: data.phase,
        learningModel: data.learningModel,
        learningApproach: data.learningApproach,
      })
      const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })
      content = normalizeStringArraySections(raw, [
        'kompetensiDasar',
        'tujuanPembelajaran',
        'kegiatan',
        'penilaian',
        'sumberBelajar',
      ])
      content.curriculum = curriculum
      content.modelPembelajaran = data.learningModel || 'Problem Based Learning (PBL)'
      if (data.learningApproach) {
        content.pendekatanPembelajaran = data.learningApproach
      }
    } catch (error) {
      return {
        status: 'generation_error' as const,
        message:
          error instanceof AiServiceError ? error.message : 'Gagal generate modul ajar. Coba lagi.',
      }
    }

    const teachingModule = await TeachingModule.create({
      userId: user.id,
      classId: data.classId,
      title: `${data.subject} - ${data.topic}`,
      subject: data.subject,
      phase: data.phase,
      content,
      status: 'draft',
    })
    await ensureDocumentWorkflow(user.id, 'teaching_module', teachingModule.id, {
      status: 'draft',
    })

    return { status: 'created', teachingModule }
  }
}

export const teachingModuleService = new TeachingModuleService()
