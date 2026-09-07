import { curriculumRepository } from '#repositories/curriculum_repository'
import type { CurriculumRepository } from '#repositories/curriculum_repository'

export interface CurriculumContext {
  sequenceId: number | null
  sequenceTitle: string | null
  curriculumVersion: string
  groupContext: 'a' | 'b' | null
  objectives: Array<{ id: number; code: string; title: string; indicators: string[] }>
}

export class CurriculumContextService {
  constructor(private readonly repository: CurriculumRepository = curriculumRepository) {}

  async getContext(userId: number, sequenceId?: number | null): Promise<CurriculumContext> {
    if (!sequenceId) {
      return {
        sequenceId: null,
        sequenceTitle: null,
        curriculumVersion: 'Kurikulum Merdeka',
        groupContext: null,
        objectives: [],
      }
    }

    const sequence = await this.repository.findContextSequence(userId, sequenceId)
    if (!sequence) throw new Error('ATP tidak ditemukan atau bukan milik pengguna')

    const ids = sequence.items
      .map((item) => Number((item as { learningObjectiveId?: number }).learningObjectiveId))
      .filter(Boolean)
    const objectives = await this.repository.listContextObjectives(ids)
    const byId = new Map(objectives.map((objective) => [objective.id, objective]))

    return {
      sequenceId: sequence.id,
      sequenceTitle: sequence.title,
      curriculumVersion: sequence.curriculumVersion,
      groupContext: sequence.groupContext,
      objectives: ids.flatMap((id) => {
        const objective = byId.get(id)
        if (!objective) return []

        return [
          {
            id: objective.id,
            code: objective.code,
            title: objective.title,
            indicators: objective.indicators.map((indicator) => indicator.description),
          },
        ]
      }),
    }
  }
}

export const curriculumContextService = new CurriculumContextService()

export const getCurriculumContext =
  curriculumContextService.getContext.bind(curriculumContextService)
