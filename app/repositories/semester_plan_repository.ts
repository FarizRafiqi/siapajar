import LearningSequence from '#models/learning_sequence'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import SemesterPlan from '#models/semester_plan'
import Subject from '#models/subject'

export class SemesterPlanRepository {
  async getIndexData(userId: number, educationLevel: string | null) {
    const [semesterPlans, classes, semesters, subjects, sequences] = await Promise.all([
      SemesterPlan.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .preload('semester')
        .orderBy('created_at', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Semester.query().where('isActive', true).preload('academicYear'),
      Subject.query()
        .where('user_id', userId)
        .where('education_level', educationLevel || 'sd')
        .where('is_active', true)
        .orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { semesterPlans, classes, semesters, subjects, sequences }
  }

  async findForUser(planId: string | number, userId: number, withRelations = false) {
    const query = SemesterPlan.query().where('id', planId).where('user_id', userId)
    if (withRelations) query.preload('schoolClass').preload('semester')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }
}

export const semesterPlanRepository = new SemesterPlanRepository()
