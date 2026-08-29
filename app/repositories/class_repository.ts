import SchoolClass from '#models/school_class'
import PaudAssessment from '#models/paud_assessment'
import Student from '#models/student'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

export class ClassRepository {
  async listOwnedClasses(userId: number) {
    return SchoolClass.query()
      .where('user_id', userId)
      .preload('academicYear')
      .preload('students')
      .orderBy('created_at', 'desc')
  }

  async findOwnedClass(userId: number, classId: string | number, withRelations = false) {
    const query = SchoolClass.query().where('id', classId).where('user_id', userId)
    if (withRelations) {
      query.preload('academicYear').preload('students')
    }

    return query.first()
  }

  async getStudentsData(userId: number, classId: string | number) {
    const schoolClass = await this.findOwnedClass(userId, classId)
    if (!schoolClass) {
      return { schoolClass: null, students: [], assessments: [] }
    }

    const [students, assessments] = await Promise.all([
      Student.query().where('class_id', schoolClass.id).orderBy('full_name', 'asc'),
      PaudAssessment.query().where('user_id', userId).where('class_id', schoolClass.id),
    ])

    return { schoolClass, students, assessments }
  }

  async findLatestPlanForClass(userId: number, classId: string | number) {
    return WeeklyLessonPlan.query()
      .where('user_id', userId)
      .where('class_id', classId)
      .orderBy('week_start_date', 'desc')
      .first()
  }

  async findClassDuplicate(
    userId: number,
    academicYearId: number,
    name: string,
    excludeId?: string | number
  ) {
    const query = SchoolClass.query()
      .where('user_id', userId)
      .where('academic_year_id', academicYearId)
      .where('name', name)
    if (excludeId !== undefined) query.whereNot('id', excludeId)

    return query.first()
  }

  async findStudentForUser(studentId: string | number, userId: number) {
    return Student.query()
      .where('id', studentId)
      .whereHas('schoolClass', (builder) => builder.where('user_id', userId))
      .first()
  }

  async findStudentDuplicate(classId: number, nis: string, excludeId?: string | number) {
    const query = Student.query().where('class_id', classId).where('nis', nis)
    if (excludeId !== undefined) query.whereNot('id', excludeId)

    return query.first()
  }
}

export const classRepository = new ClassRepository()
