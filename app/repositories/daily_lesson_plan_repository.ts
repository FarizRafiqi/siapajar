import DailyLessonPlan from '#models/daily_lesson_plan'
import LearningSequence from '#models/learning_sequence'
import SchoolClass from '#models/school_class'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

export class DailyLessonPlanRepository {
  async getIndexData(userId: number) {
    const [dailyLessonPlans, classes, weeklyLessonPlans, sequences] = await Promise.all([
      DailyLessonPlan.query()
        .where('user_id', userId)
        .preload('schoolClass')
        .orderBy('date', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      WeeklyLessonPlan.query().where('user_id', userId).orderBy('week_start_date', 'desc'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { dailyLessonPlans, classes, weeklyLessonPlans, sequences }
  }

  async findForUser(planId: string | number, userId: number, withRelations = false) {
    const query = DailyLessonPlan.query().where('id', planId).where('user_id', userId)
    if (withRelations) query.preload('schoolClass').preload('weeklyLessonPlan')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }

  async findWeeklyPlanForUser(planId: string | number, userId: number) {
    return WeeklyLessonPlan.query().where('id', planId).where('user_id', userId).first()
  }
}

export const dailyLessonPlanRepository = new DailyLessonPlanRepository()
