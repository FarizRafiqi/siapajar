import LearningSequence from '#models/learning_sequence'
import MediaModule from '#models/media_module'
import SchoolClass from '#models/school_class'

export class MediaModuleRepository {
  async getIndexData(userId: number) {
    const [mediaModules, classes, sequences] = await Promise.all([
      MediaModule.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .orderBy('created_at', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { mediaModules, classes, sequences }
  }

  async findForUser(mediaModuleId: string | number, userId: number, withSchoolClass = false) {
    const query = MediaModule.query().where('id', mediaModuleId).where('user_id', userId)
    if (withSchoolClass) query.preload('schoolClass')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }
}

export const mediaModuleRepository = new MediaModuleRepository()
