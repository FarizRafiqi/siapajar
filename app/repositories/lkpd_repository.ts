import LearningSequence from '#models/learning_sequence'
import Lkpd from '#models/lkpd'
import SchoolClass from '#models/school_class'

export class LkpdRepository {
  async getIndexData(userId: number) {
    const [lkpds, classes, sequences] = await Promise.all([
      Lkpd.query().where('user_id', userId).preload('schoolClass').orderBy('created_at', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { lkpds, classes, sequences }
  }

  async findForUser(lkpdId: string | number, userId: number, withSchoolClass = false) {
    const query = Lkpd.query().where('id', lkpdId).where('user_id', userId)
    if (withSchoolClass) query.preload('schoolClass')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }
}

export const lkpdRepository = new LkpdRepository()
