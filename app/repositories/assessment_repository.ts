import type { DateTime } from 'luxon'
import Assessment from '#models/assessment'
import Score from '#models/score'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import Student from '#models/student'
import Subject from '#models/subject'

export type CreateAssessmentRepositoryData = {
  userId: number
  classId: number
  semesterId: number | null
  subject: string
  type: 'formative' | 'summative'
  title: string
  learningObjective: string | null
  date: DateTime
}

export type AssessmentScoreUpdate = {
  studentId: number
  value: number | null
  note?: string | null
}

export class AssessmentRepository {
  async getIndexData(userId: number, educationLevel: string | null) {
    const [assessments, classes, subjects] = await Promise.all([
      Assessment.query().where('user_id', userId).preload('schoolClass').orderBy('date', 'desc'),
      SchoolClass.query().where('user_id', userId).orderBy('name'),
      Subject.query()
        .where('user_id', userId)
        .where('education_level', educationLevel || 'sd')
        .where('is_active', true)
        .orderBy('name'),
    ])

    return { assessments, classes, subjects }
  }

  async findForUser(assessmentId: string | number, userId: number, withScores = false) {
    const query = Assessment.query().where('id', assessmentId).where('user_id', userId)
    if (withScores) {
      query.preload('schoolClass').preload('scores', (scoreQuery) => scoreQuery.preload('student'))
    }

    return query.first()
  }

  async findOwnedClass(classId: string | number, userId: number) {
    return SchoolClass.query().where('id', classId).where('user_id', userId).first()
  }

  async findActiveSemester(academicYearId: number) {
    return Semester.query()
      .where('academic_year_id', academicYearId)
      .where('is_active', true)
      .first()
  }

  async createWithInitialScores(data: CreateAssessmentRepositoryData, studentClassId: number) {
    const assessment = await Assessment.create(data)
    const students = await Student.query().where('class_id', studentClassId)

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

  async updateScores(assessmentId: number, scores: AssessmentScoreUpdate[]) {
    for (const score of scores) {
      await Score.query()
        .where('assessment_id', assessmentId)
        .where('student_id', score.studentId)
        .update({ value: score.value, note: score.note ?? null })
    }
  }
}

export const assessmentRepository = new AssessmentRepository()
