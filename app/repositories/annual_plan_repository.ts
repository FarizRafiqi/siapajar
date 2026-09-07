import AcademicYear from '#models/academic_year'
import AnnualPlan from '#models/annual_plan'
import LearningSequence from '#models/learning_sequence'
import Subject from '#models/subject'

export class AnnualPlanRepository {
  async getIndexData(userId: number, educationLevel: string | null) {
    const [annualPlans, academicYears, subjects, sequences] = await Promise.all([
      AnnualPlan.query()
        .where('user_id', userId)
        .preload('academicYear')
        .orderBy('created_at', 'desc'),
      AcademicYear.query().orderBy('name', 'desc'),
      Subject.query()
        .where('user_id', userId)
        .where('education_level', educationLevel || 'sd')
        .where('is_active', true)
        .orderBy('name'),
      LearningSequence.query().where('user_id', userId).orderBy('title'),
    ])

    return { annualPlans, academicYears, subjects, sequences }
  }

  async findForUser(planId: string | number, userId: number, withAcademicYear = false) {
    const query = AnnualPlan.query().where('id', planId).where('user_id', userId)
    if (withAcademicYear) query.preload('academicYear')

    return query.first()
  }
}

export const annualPlanRepository = new AnnualPlanRepository()
