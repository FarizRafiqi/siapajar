import Exam from '#models/exam'
import SchoolClass from '#models/school_class'
import Subject from '#models/subject'
import User from '#models/user'

export class ExamRepository {
  async getIndexData(userId: number, educationLevel: string | null) {
    const [exams, classes, subjects] = await Promise.all([
      Exam.query().where('user_id', userId).preload('schoolClass').orderBy('created_at', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query()
        .where('user_id', userId)
        .where('education_level', educationLevel || 'sd')
        .where('is_active', true)
        .orderBy('name'),
    ])

    return { exams, classes, subjects }
  }

  async findForUser(examId: string | number, userId: number, withSchoolClass = false) {
    const query = Exam.query().where('id', examId).where('user_id', userId)
    if (withSchoolClass) query.preload('schoolClass')

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }

  async findForGeneration(examId: number) {
    return Exam.query().where('id', examId).firstOrFail()
  }

  async findUserForGeneration(userId: number) {
    return User.query().where('id', userId).firstOrFail()
  }
}

export const examRepository = new ExamRepository()
