import Assessment from '#models/assessment'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import Student from '#models/student'
import Score from '#models/score'
import Subject from '#models/subject'

export class AssessmentRepository {
  async getIndexData(userId: number, educationLevel: string = 'sd') {
    const assessments = await Assessment.query()
      .where('user_id', userId)
      .preload('schoolClass')
      .orderBy('date', 'desc')

    const classes = await SchoolClass.query().where('user_id', userId).orderBy('name')

    const subjects = await Subject.query()
      .where('user_id', userId)
      .where('education_level', educationLevel)
      .where('is_active', true)
      .orderBy('name')

    return { assessments, classes, subjects }
  }

  async findForUser(id: string | number, userId: number, withRelations = false) {
    const query = Assessment.query().where('id', id).where('user_id', userId)

    if (withRelations) {
      query.preload('schoolClass').preload('scores', (q) => q.preload('student'))
    }

    return query.first()
  }

  async findOwnedClass(id: string | number, userId: number) {
    return SchoolClass.query().where('id', id).where('user_id', userId).first()
  }

  async findActiveSemester(academicYearId: number) {
    return Semester.query()
      .where('academic_year_id', academicYearId)
      .where('is_active', true)
      .first()
  }

  async createWithInitialScores(payload: {
    userId: number
    classId: number
    semesterId: number | null
    subject: string
    type: 'formative' | 'summative'
    title: string
    learningObjective?: string | null
    date: any
  }) {
    const assessment = await Assessment.create({
      userId: payload.userId,
      classId: payload.classId,
      semesterId: payload.semesterId,
      subject: payload.subject,
      type: payload.type,
      title: payload.title,
      learningObjective: payload.learningObjective ?? null,
      date: payload.date,
    })

    const students = await Student.query().where('class_id', payload.classId)
    for (const student of students) {
      await Score.create({
        assessmentId: assessment.id,
        studentId: student.id,
        value: null,
        note: null,
      })
    }

    return assessment
  }

  async updateScores(
    id: string | number,
    scores: Array<{ studentId: number; value: number | null; note?: string | null }>
  ) {
    for (const s of scores) {
      await Score.query()
        .where('assessment_id', id)
        .where('student_id', s.studentId)
        .update({ value: s.value, note: s.note ?? null })
    }
  }
}

export const assessmentRepository = new AssessmentRepository()
