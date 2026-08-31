import LearningSequence from '#models/learning_sequence'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import TeachingModule from '#models/teaching_module'

export class TeachingModuleRepository {
  async getIndexData(userId: number, educationLevel: string | null) {
    const [teachingModules, classes, subjects, sequences] = await Promise.all([
      TeachingModule.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .orderBy('created_at', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query()
        .where('user_id', userId)
        .where('education_level', educationLevel || 'sd')
        .where('is_active', true)
        .orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { teachingModules, classes, subjects, sequences }
  }

  async findForUser(moduleId: string | number, userId: number, withSchoolClass = false) {
    const query = TeachingModule.query().where('id', moduleId).where('user_id', userId)
    if (withSchoolClass) query.preload('schoolClass')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }
}

export const teachingModuleRepository = new TeachingModuleRepository()
