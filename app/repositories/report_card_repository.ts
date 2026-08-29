import db from '@adonisjs/lucid/services/db'
import PaudAssessment from '#models/paud_assessment'
import ReportNarrative from '#models/report_narrative'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'
import Student from '#models/student'

export type NumericReportRow = {
  student_id: number
  subject: string
  average: number | string | null
}

export class ReportCardRepository {
  async getIndexData(userId: number) {
    const [classes, semesters] = await Promise.all([
      SchoolClass.query().where('user_id', userId).preload('academicYear').orderBy('name'),
      Semester.query().preload('academicYear').orderBy('academic_year_id', 'desc').orderBy('name'),
    ])

    return { classes, semesters }
  }

  async findOwnedClass(classId: number, userId: number, withAcademicYear = false) {
    const query = SchoolClass.query().where('id', classId).where('user_id', userId)
    if (withAcademicYear) query.preload('academicYear')

    return query.first()
  }

  async findSemester(semesterId: number, withAcademicYear = false) {
    const query = Semester.query().where('id', semesterId)
    if (withAcademicYear) query.preload('academicYear')

    return query.first()
  }

  async getNumericReportData(classId: number, semesterId: number, userId: number) {
    const [students, rows] = await Promise.all([
      Student.query().where('class_id', classId).orderBy('full_name'),
      db
        .from('scores')
        .join('assessments', 'assessments.id', 'scores.assessment_id')
        .where('assessments.class_id', classId)
        .where('assessments.semester_id', semesterId)
        .where('assessments.user_id', userId)
        .whereNotNull('scores.value')
        .select('scores.student_id', 'assessments.subject')
        .avg('scores.value as average')
        .groupBy('scores.student_id', 'assessments.subject'),
    ])

    return { students, rows: rows as NumericReportRow[] }
  }

  async getNarrativeReportData(classId: number, semesterId: number, userId: number) {
    const [students, assessments, savedNarratives] = await Promise.all([
      Student.query().where('class_id', classId).orderBy('full_name'),
      PaudAssessment.query()
        .where('class_id', classId)
        .where('semester_id', semesterId)
        .where('user_id', userId)
        .orderBy('date', 'asc'),
      ReportNarrative.query()
        .where('class_id', classId)
        .where('semester_id', semesterId)
        .where('user_id', userId),
    ])

    return { students, assessments, savedNarratives }
  }

  async findStudentInClass(studentId: number, classId: number) {
    return Student.query().where('id', studentId).where('class_id', classId).first()
  }

  async findOwnedNarrative(narrativeId: string | number, userId: number) {
    return ReportNarrative.query().where('id', narrativeId).where('user_id', userId).first()
  }
}

export const reportCardRepository = new ReportCardRepository()
