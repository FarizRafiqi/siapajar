import CurriculumPreset from '#models/curriculum_preset'
import LearningSequence from '#models/learning_sequence'
import SchoolClass from '#models/school_class'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

export class WeeklyLessonPlanRepository {
  async getIndexData(userId: number) {
    const [weeklyLessonPlans, classes, sequences, presets] = await Promise.all([
      WeeklyLessonPlan.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .orderBy('week_start_date', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
      CurriculumPreset.query()
        .where('education_level', 'tk')
        .where('is_active', true)
        .orderBy('semester', 'asc')
        .orderBy('sort_order', 'asc')
        .orderBy('week_number', 'asc'),
    ])

    return { weeklyLessonPlans, classes, sequences, presets }
  }

  async findForUser(planId: string | number, userId: number, withSchoolClass = false) {
    const query = WeeklyLessonPlan.query().where('id', planId).where('user_id', userId)
    if (withSchoolClass) query.preload('schoolClass')

    return query.first()
  }

  async findOwnedClassWithStudents(classId: string | number, userId: number) {
    return SchoolClass.query()
      .where('id', classId)
      .where('user_id', userId)
      .preload('students')
      .first()
  }
}

export const weeklyLessonPlanRepository = new WeeklyLessonPlanRepository()
