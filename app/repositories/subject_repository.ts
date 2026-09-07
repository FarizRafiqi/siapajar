import Subject from '#models/subject'

export type SubjectDefault = {
  name: string
  educationLevel: 'tk' | 'sd'
}

export class SubjectRepository {
  async listForUser(userId: number, educationLevel: 'tk' | 'sd') {
    return Subject.query()
      .where('user_id', userId)
      .where('education_level', educationLevel)
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')
  }

  async findDuplicate(userId: number, name: string, educationLevel: 'tk' | 'sd') {
    return Subject.query()
      .where('user_id', userId)
      .where('name', name)
      .where('education_level', educationLevel)
      .first()
  }

  async findOwnedById(userId: number, subjectId: string | number) {
    return Subject.query().where('id', subjectId).where('user_id', userId).first()
  }

  async replaceWithDefaults(userId: number, educationLevel: 'tk' | 'sd', defaults: string[]) {
    if (educationLevel === 'tk') {
      await Subject.query()
        .where('userId', userId)
        .where('educationLevel', 'tk')
        .whereNotIn('name', defaults)
        .delete()
    }

    for (const name of defaults) {
      await Subject.updateOrCreate(
        { userId, name, educationLevel },
        { userId, name, educationLevel, gradeLevel: null, isActive: true }
      )
    }
  }
}

export const subjectRepository = new SubjectRepository()
