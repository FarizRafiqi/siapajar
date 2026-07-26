import db from '@adonisjs/lucid/services/db'
import Student from '#models/student'
import PaudAssessment from '#models/paud_assessment'

export interface SubjectAverage {
  subject: string
  average: number | null
}

export interface StudentReport {
  studentId: number
  nis: string
  fullName: string
  subjects: SubjectAverage[]
  overallAverage: number | null
  rank: number | null
}

export interface ClassReportCard {
  subjects: string[]
  students: StudentReport[]
}

/**
 * Rata-rata nilai per mapel per siswa (dari Score/Assessment) untuk satu kelas + semester,
 * plus peringkat kelas berdasarkan rata-rata keseluruhan (dense rank, nilai kosong di akhir).
 */
export async function computeClassReportCard(
  classId: number,
  semesterId: number,
  userId: number
): Promise<ClassReportCard> {
  const students = await Student.query().where('class_id', classId).orderBy('full_name')

  const rows = await db
    .from('scores')
    .join('assessments', 'assessments.id', 'scores.assessment_id')
    .where('assessments.class_id', classId)
    .where('assessments.semester_id', semesterId)
    .where('assessments.user_id', userId)
    .whereNotNull('scores.value')
    .select('scores.student_id', 'assessments.subject')
    .avg('scores.value as average')
    .groupBy('scores.student_id', 'assessments.subject')

  const byStudent = new Map<number, Map<string, number>>()
  for (const row of rows) {
    if (!byStudent.has(row.student_id)) {
      byStudent.set(row.student_id, new Map())
    }
    byStudent.get(row.student_id)!.set(row.subject, Number(row.average))
  }

  const subjects = Array.from(new Set(rows.map((r) => r.subject as string))).sort()

  const reports: StudentReport[] = students.map((student) => {
    const subjectMap = byStudent.get(student.id) ?? new Map<string, number>()
    const subjectAverages = subjects.map((subject) => ({
      subject,
      average: subjectMap.has(subject) ? subjectMap.get(subject)! : null,
    }))
    const values = subjectAverages.map((s) => s.average).filter((v): v is number => v !== null)
    const overallAverage = values.length
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : null

    return {
      studentId: student.id,
      nis: student.nis,
      fullName: student.fullName,
      subjects: subjectAverages,
      overallAverage,
      rank: null,
    }
  })

  const ranked = [...reports].sort((a, b) => {
    if (a.overallAverage === null && b.overallAverage === null) return 0
    if (a.overallAverage === null) return 1
    if (b.overallAverage === null) return -1
    return b.overallAverage - a.overallAverage
  })

  let currentRank = 0
  let previousAverage: number | null = null
  ranked.forEach((report, index) => {
    if (report.overallAverage === null) {
      report.rank = null
      return
    }
    if (report.overallAverage !== previousAverage) {
      currentRank = index + 1
      previousAverage = report.overallAverage
    }
    report.rank = currentRank
  })

  reports.sort((a, b) => {
    if (a.rank === null && b.rank === null) return a.fullName.localeCompare(b.fullName)
    if (a.rank === null) return 1
    if (b.rank === null) return -1
    return a.rank - b.rank
  })

  return { subjects, students: reports }
}

const PAUD_TYPE_LABELS: Record<string, string> = {
  checklist: 'Ceklis',
  anecdotal_note: 'Catatan Anekdot',
  work_sample: 'Hasil Karya',
  photo_series: 'Foto Berseri',
}

export interface PaudStudentNarrative {
  studentId: number
  nis: string
  fullName: string
  entries: { type: string; typeLabel: string; date: string; content: Record<string, unknown> }[]
}

/**
 * TK/PAUD tidak diberi peringkat numerik — kompilasi asesmen (ceklis, catatan anekdot,
 * hasil karya, foto berseri) per siswa menjadi ringkasan naratif per semester.
 */
export async function compileNarrativeReport(
  classId: number,
  semesterId: number,
  userId: number
): Promise<PaudStudentNarrative[]> {
  const students = await Student.query().where('class_id', classId).orderBy('full_name')

  const assessments = await PaudAssessment.query()
    .where('class_id', classId)
    .where('semester_id', semesterId)
    .where('user_id', userId)
    .orderBy('date', 'asc')

  const byStudent = new Map<number, PaudAssessment[]>()
  for (const assessment of assessments) {
    if (!byStudent.has(assessment.studentId)) {
      byStudent.set(assessment.studentId, [])
    }
    byStudent.get(assessment.studentId)!.push(assessment)
  }

  return students.map((student) => ({
    studentId: student.id,
    nis: student.nis,
    fullName: student.fullName,
    entries: (byStudent.get(student.id) ?? []).map((a) => ({
      type: a.type,
      typeLabel: PAUD_TYPE_LABELS[a.type] ?? a.type,
      date: a.date.toISODate() ?? '',
      content: a.content,
    })),
  }))
}
