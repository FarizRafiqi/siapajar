import type User from '#models/user'
import CurriculumCp from '#models/curriculum_cp'
import IktpIndicator from '#models/iktp_indicator'
import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { exportCurriculum } from '#services/export_service'
import { exportCurriculumPdf } from '#services/pdf_export_service'
import { PAUD_CURRICULUM_PRESETS, type PresetCp } from '#services/curriculum_presets'
import { curriculumRepository } from '#repositories/curriculum_repository'
import type { CurriculumRepository } from '#repositories/curriculum_repository'

export class CurriculumService {
  constructor(private readonly repository: CurriculumRepository = curriculumRepository) {}

  async getIndexData(user: User) {
    const { cps, sequences } = await this.repository.getIndexData(user.id)

    return {
      cps: cps.map((cp) => cp.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
      profile: {
        educationLevel: user.educationLevel,
        institutionType: user.institutionType,
        curriculumVersion: user.curriculumVersion,
        defaultGroupContext: user.defaultGroupContext,
      },
    }
  }

  async getPrintData(user: User) {
    const { cps, sequences } = await this.prepareExportData(user.id)

    return {
      cps,
      sequences,
      profile: this.getExportProfile(user),
    }
  }

  async exportDocx(user: User) {
    const { cps, sequences } = await this.prepareExportData(user.id)
    return exportCurriculum(cps, sequences, user)
  }

  async exportPdf(user: User, charge = true) {
    const { cps, sequences } = await this.prepareExportData(user.id)
    return exportCurriculumPdf(cps, sequences, user, charge)
  }

  async storeObjective(user: User, data: Record<string, any>) {
    await assertEntitled(user, 'custom_atp')
    const cp = await CurriculumCp.find(data.cpId)
    if (!cp) return false

    await LearningObjective.create({ ...data, userId: user.id, source: 'custom' })
    await recordUsage(user.id, 'custom_atp')
    return true
  }

  async destroyObjective(user: User, objectiveId: string | number) {
    const objective = await this.repository.findAccessibleObjective(
      objectiveId,
      user.id,
      user.role === 'admin'
    )

    if (!objective) return false

    await IktpIndicator.query().where('learning_objective_id', objective.id).delete()
    await objective.delete()
    return true
  }

  async storeSequence(user: User, data: Record<string, any>) {
    await this.assertObjectivesOwned(
      data.items?.map((item: { learningObjectiveId: number }) => item.learningObjectiveId) ?? [],
      user.id
    )

    await LearningSequence.create({
      ...data,
      userId: user.id,
      schoolId: user.schoolId,
      curriculumVersion: data.curriculumVersion ?? user.curriculumVersion ?? 'Kurikulum Merdeka',
      items: data.items ?? [],
      status: 'draft',
    })
  }

  async sequenceExists(userId: number, sequenceId: string | number) {
    return Boolean(await this.repository.findSequenceForUser(sequenceId, userId))
  }

  async updateSequence(user: User, sequenceId: string | number, data: Record<string, any>) {
    const sequence = await this.repository.findSequenceForUser(sequenceId, user.id)
    if (!sequence) return false

    if (data.items) {
      await this.assertObjectivesOwned(
        data.items.map((item: { learningObjectiveId: number }) => item.learningObjectiveId),
        user.id
      )
    }

    await sequence.merge(data).save()
    return true
  }

  async destroySequence(userId: number, sequenceId: string | number) {
    const sequence = await this.repository.findSequenceForUser(sequenceId, userId)
    if (!sequence) return false

    await sequence.delete()
    return true
  }

  async storeIndicator(user: User, data: Record<string, any>) {
    await assertEntitled(user, 'custom_iktp')
    const objective = await this.repository.findAccessibleObjective(
      data.learningObjectiveId,
      user.id
    )
    if (!objective) return false

    await IktpIndicator.create({ ...data, userId: user.id })
    await recordUsage(user.id, 'custom_iktp')
    return true
  }

  async seedPresets(user: User) {
    const preset = PAUD_CURRICULUM_PRESETS
    let currentCps = await this.repository.listBaseCps()

    if (currentCps.length === 0) {
      for (const cpData of preset.cps) {
        await CurriculumCp.create({
          code: cpData.code,
          element: cpData.element,
          title: cpData.title,
          description: cpData.description,
        })
      }
      currentCps = await this.repository.listBaseCps()
    }

    const createdObjectiveIds: number[] = []
    for (const cpData of preset.cps) {
      const targetCp = currentCps.find((cp) => cp.code === cpData.code) || currentCps[0]
      if (!targetCp) continue

      const ids = await this.seedObjectivesForCp(cpData, targetCp.id, user.id)
      createdObjectiveIds.push(...ids)
    }

    const existingSequence = await this.repository.findSequenceByTitle(
      user.id,
      preset.sequence.title
    )
    if (!existingSequence && createdObjectiveIds.length > 0) {
      await LearningSequence.create({
        userId: user.id,
        schoolId: user.schoolId,
        title: preset.sequence.title,
        educationLevel: preset.sequence.educationLevel,
        groupContext: preset.sequence.groupContext || 'a',
        curriculumVersion: 'Kurikulum Merdeka',
        status: 'draft',
        items: createdObjectiveIds.map((id, index) => ({
          learningObjectiveId: id,
          order: index + 1,
        })),
      })
    }
  }

  async resetPresets(userId: number) {
    await this.repository.deleteUserPresetData(userId)
  }

  private async seedObjectivesForCp(cpData: PresetCp, targetCpId: number, userId: number) {
    const createdObjectiveIds: number[] = []

    for (const objectiveData of cpData.objectives) {
      let objective = await this.repository.findObjectiveByCode(objectiveData.code, userId)
      objective ??= await LearningObjective.create({
        cpId: targetCpId,
        code: objectiveData.code,
        title: objectiveData.title,
        groupContext: objectiveData.groupContext || 'a',
        userId,
        source: 'custom',
      })
      createdObjectiveIds.push(objective.id)

      for (const indicatorData of objectiveData.indicators) {
        const existingIndicator = await this.repository.findIndicatorByDescription(
          objective.id,
          indicatorData.description
        )
        if (!existingIndicator) {
          await IktpIndicator.create({
            learningObjectiveId: objective.id,
            description: indicatorData.description,
            evidenceType: indicatorData.evidenceType,
            achievementCriteria: indicatorData.achievementCriteria,
            userId,
          })
        }
      }
    }

    return createdObjectiveIds
  }

  private async assertObjectivesOwned(ids: number[], userId: number) {
    if (ids.length === 0) return

    const count = await this.repository.countAccessibleObjectives(ids, userId)
    if (count !== new Set(ids).size) {
      throw new Error('TP tidak valid atau bukan milik pengguna')
    }
  }

  private async prepareExportData(userId: number) {
    const { cps, sequences, allObjectives } = await this.repository.getExportData(userId)
    const objectiveMap = new Map(
      allObjectives.map((objective) => [objective.id, objective.toJSON()])
    )

    const sequencesJson = sequences.map((sequence) => {
      const json = sequence.toJSON()
      json.items = (json.items || []).map((item: any) => {
        const objective = objectiveMap.get(item.learningObjectiveId)
        return {
          ...item,
          code: objective?.code || `TP-${item.learningObjectiveId}`,
          title: objective?.title || `Tujuan Pembelajaran #${item.learningObjectiveId}`,
          indicators: objective?.indicators || [],
        }
      })
      return json
    })

    return {
      cps: cps.map((cp) => cp.toJSON()),
      sequences: sequencesJson,
    }
  }

  private getExportProfile(user: User) {
    return {
      institutionName: (user as any).institutionName || user.schoolName || 'TK Tunas Bangsa',
      educationLevel:
        user.institutionType === 'ra' ? 'RA' : user.educationLevel?.toUpperCase() || 'TK',
      institutionType: user.institutionType || 'tk',
      jenjangFase: `${user.institutionType === 'ra' ? 'RA' : user.educationLevel?.toUpperCase() || 'TK'} / Fase Fondasi`,
      curriculumVersion: user.curriculumVersion || 'Kurikulum Merdeka',
      teacherName: user.fullName || 'Guru Kelas',
      teacherNip: (user as any).nip || '-',
      principalName: (user as any).principalName || 'Kepala Sekolah',
      principalNip: (user as any).principalNip || '-',
    }
  }
}

export const curriculumService = new CurriculumService()
