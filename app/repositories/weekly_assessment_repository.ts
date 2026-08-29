import type { DateTime } from 'luxon'
import PaudAssessment from '#models/paud_assessment'
import Student from '#models/student'

export class WeeklyAssessmentRepository {
  async findForWeeklyPlan(
    userId: number | null | undefined,
    classId: number | null | undefined,
    weekStartDate?: DateTime | null
  ) {
    let classStudents: Student[] = []
    if (classId) {
      classStudents = await Student.query().where('class_id', classId).orderBy('full_name', 'asc')
    }

    if (!userId || !classId) {
      return { classStudents, assessments: [] as PaudAssessment[] }
    }

    const query = PaudAssessment.query()
      .where('user_id', userId)
      .where('class_id', classId)
      .preload('student')
      .preload('attachments', (q) => q.orderBy('display_order', 'asc'))
      .orderBy('date', 'asc')

    if (weekStartDate) {
      const startDate = weekStartDate.startOf('day')
      const endDate = startDate.plus({ days: 6 }).endOf('day')

      const dateFiltered = await query
        .clone()
        .where('date', '>=', startDate.toISODate()!)
        .where('date', '<=', endDate.toISODate()!)

      if (dateFiltered.length > 0) {
        return { classStudents, assessments: dateFiltered }
      }
    }

    return { classStudents, assessments: await query }
  }
}

export const weeklyAssessmentRepository = new WeeklyAssessmentRepository()
