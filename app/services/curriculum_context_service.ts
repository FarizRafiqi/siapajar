import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'

export interface CurriculumContext {
  sequenceId: number | null
  sequenceTitle: string | null
  curriculumVersion: string
  groupContext: 'a' | 'b' | null
  objectives: Array<{ id: number; code: string; title: string; indicators: string[] }>
}

export async function getCurriculumContext(userId: number, sequenceId?: number | null): Promise<CurriculumContext> {
  if (!sequenceId) return { sequenceId: null, sequenceTitle: null, curriculumVersion: 'Kurikulum Merdeka', groupContext: null, objectives: [] }
  const sequence = await LearningSequence.query().where('id', sequenceId).where('user_id', userId).first()
  if (!sequence) throw new Error('ATP tidak ditemukan atau bukan milik pengguna')
  const ids = sequence.items.map((item) => Number((item as { learningObjectiveId?: number }).learningObjectiveId)).filter(Boolean)
  const objectives = ids.length ? await LearningObjective.query().whereIn('id', ids).preload('indicators') : []
  const byId = new Map(objectives.map((objective) => [objective.id, objective]))
  return {
    sequenceId: sequence.id,
    sequenceTitle: sequence.title,
    curriculumVersion: sequence.curriculumVersion,
    groupContext: sequence.groupContext,
    objectives: ids.map((id) => byId.get(id)).filter((objective): objective is LearningObjective => Boolean(objective)).map((objective) => ({ id: objective.id, code: objective.code, title: objective.title, indicators: objective.indicators.map((indicator) => indicator.description) })),
  }
}
