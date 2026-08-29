import CurriculumCp from '#models/curriculum_cp'
import IktpIndicator from '#models/iktp_indicator'
import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'

export class CurriculumRepository {
  async getIndexData(userId: number) {
    const [cps, sequences] = await Promise.all([
      CurriculumCp.query()
        .preload('learningObjectives', (builder) => {
          builder
            .where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
            .preload('indicators')
        })
        .orderBy('id'),
      LearningSequence.query().where('user_id', userId).orderBy('updated_at', 'desc'),
    ])

    return { cps, sequences }
  }

  async getExportData(userId: number) {
    const [cps, sequences, allObjectives] = await Promise.all([
      CurriculumCp.query()
        .preload('learningObjectives', (builder) => {
          builder
            .where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
            .preload('indicators')
        })
        .orderBy('id'),
      LearningSequence.query().where('user_id', userId).orderBy('updated_at', 'desc'),
      LearningObjective.query()
        .where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
        .preload('indicators'),
    ])

    return { cps, sequences, allObjectives }
  }

  async findAccessibleObjective(
    objectiveId: string | number,
    userId: number,
    allowAnyOwner = false
  ) {
    const query = LearningObjective.query().where('id', objectiveId)
    if (!allowAnyOwner) {
      query.where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
    }

    return query.first()
  }

  async findSequenceForUser(sequenceId: string | number, userId: number) {
    return LearningSequence.query().where('id', sequenceId).where('user_id', userId).first()
  }

  async findObjectiveByCode(code: string, userId: number) {
    return LearningObjective.query()
      .where('code', code)
      .where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
      .first()
  }

  async findIndicatorByDescription(objectiveId: number, description: string) {
    return IktpIndicator.query()
      .where('learning_objective_id', objectiveId)
      .where('description', description)
      .first()
  }

  async findSequenceByTitle(userId: number, title: string) {
    return LearningSequence.query().where('user_id', userId).where('title', title).first()
  }

  async countAccessibleObjectives(ids: number[], userId: number) {
    if (ids.length === 0) return 0

    const count = await LearningObjective.query()
      .whereIn('id', ids)
      .where((scope) => scope.whereNull('user_id').orWhere('user_id', userId))
      .count('* as total')

    return Number(count[0].$extras.total)
  }

  async listBaseCps() {
    return CurriculumCp.query().orderBy('id')
  }

  async deleteUserPresetData(userId: number) {
    await IktpIndicator.query().where('user_id', userId).delete()
    await LearningSequence.query().where('user_id', userId).delete()
    await LearningObjective.query().where('user_id', userId).delete()
  }

  async deleteObjectiveWithIndicators(objective: LearningObjective) {
    await IktpIndicator.query().where('learning_objective_id', objective.id).delete()
    await objective.delete()
  }

  async findContextSequence(userId: number, sequenceId: number) {
    return LearningSequence.query().where('id', sequenceId).where('user_id', userId).first()
  }

  async listContextObjectives(ids: number[]) {
    if (ids.length === 0) return []
    return LearningObjective.query().whereIn('id', ids).preload('indicators')
  }
}

export const curriculumRepository = new CurriculumRepository()
