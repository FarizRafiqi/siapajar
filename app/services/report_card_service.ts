import type User from '#models/user'
import type SchoolClass from '#models/school_class'
import type Semester from '#models/semester'
import ReportNarrative from '#models/report_narrative'
import { reportCardRepository } from '#repositories/report_card_repository'
import type { NumericReportRow, ReportCardRepository } from '#repositories/report_card_repository'
import { exportNarrativeReport, exportStudentReport } from '#services/export_service'
import { exportNarrativeReportPdf, exportReportCardPdf } from '#services/pdf_export_service'
import { exportFilename } from '#services/export_file_service'
import GenerateNarratives from '#jobs/generate_narratives'
import { DateTime } from 'luxon'

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
  narratives: {
    id: number | null
    element: string
    content: string
    status: 'draft' | 'approved'
  }[]
}

export type ReportCardShowData =
  | {
      mode: 'narrative'
      schoolClass: ReturnType<SchoolClass['toJSON']>
      semester: ReturnType<Semester['toJSON']>
      narrative: PaudStudentNarrative[]
    }
  | {
      mode: 'numeric'
      schoolClass: ReturnType<SchoolClass['toJSON']>
      semester: ReturnType<Semester['toJSON']>
      report: ClassReportCard
    }

export type StudentReportExportResult =
  | { status: 'context_not_found' }
  | { status: 'student_not_found' }
  | { status: 'ready'; buffer: Buffer; filename: string }

export type SaveNarrativeResult = 'context_not_found' | 'invalid_content' | 'saved'

export type GenerateNarrativesResult =
  { status: 'context_not_found' } | { status: 'queued'; jobId: string }

export class ReportCardService {
  constructor(private readonly repository: ReportCardRepository = reportCardRepository) {}

  async getIndexData(user: User) {
    const { classes, semesters } = await this.repository.getIndexData(user.id)

    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      semesters: semesters.map((semester) => semester.toJSON()),
      isTk: user.isTk,
    }
  }

  async getClassContext(classId: number, semesterId: number, userId: number) {
    const schoolClass = await this.repository.findOwnedClass(classId, userId, true)
    if (!schoolClass) return null

    const semester = await this.repository.findSemester(semesterId, true)
    if (!semester) return null

    return { schoolClass, semester }
  }

  async getShowData(
    classId: number,
    semesterId: number,
    user: User
  ): Promise<ReportCardShowData | null> {
    const context = await this.getClassContext(classId, semesterId, user.id)
    if (!context) return null

    if (user.isTk) {
      return {
        mode: 'narrative',
        schoolClass: context.schoolClass.toJSON(),
        semester: context.semester.toJSON(),
        narrative: await this.compileNarrativeReport(classId, semesterId, user.id),
      }
    }

    return {
      mode: 'numeric',
      schoolClass: context.schoolClass.toJSON(),
      semester: context.semester.toJSON(),
      report: await this.computeClassReportCard(classId, semesterId, user.id),
    }
  }

  async getStudentExportData(
    classId: number,
    semesterId: number,
    studentId: number,
    user: User,
    format: 'pdf' | 'docx',
    inline = false
  ): Promise<StudentReportExportResult> {
    const context = await this.getClassContext(classId, semesterId, user.id)
    if (!context) return { status: 'context_not_found' }

    const semesterLabel = `${context.semester.name} ${context.semester.academicYear.name}`
    if (user.isTk) {
      const narrative = await this.compileNarrativeReport(classId, semesterId, user.id)
      const studentNarrative = narrative.find((item) => item.studentId === studentId)
      if (!studentNarrative) return { status: 'student_not_found' }

      const buffer =
        format === 'pdf'
          ? await exportNarrativeReportPdf(
              studentNarrative,
              user,
              {
                className: context.schoolClass.name,
                semesterLabel,
                totalStudents: narrative.length,
              },
              !inline
            )
          : await exportNarrativeReport(studentNarrative, user, {
              className: context.schoolClass.name,
              semesterLabel,
            })

      return {
        status: 'ready',
        buffer,
        filename: exportFilename(
          ['Rapor Perkembangan', studentNarrative.fullName, semesterLabel],
          format
        ),
      }
    }

    const report = await this.computeClassReportCard(classId, semesterId, user.id)
    const studentReport = report.students.find((item) => item.studentId === studentId)
    if (!studentReport) return { status: 'student_not_found' }

    const buffer =
      format === 'pdf'
        ? await exportReportCardPdf(
            studentReport,
            user,
            {
              className: context.schoolClass.name,
              semesterLabel,
              totalStudents: report.students.length,
            },
            !inline
          )
        : await exportStudentReport(studentReport, user, {
            className: context.schoolClass.name,
            semesterLabel,
            totalStudents: report.students.length,
          })

    return {
      status: 'ready',
      buffer,
      filename: exportFilename(['Rapor', studentReport.fullName, semesterLabel], format),
    }
  }

  async saveNarrative(
    userId: number,
    classId: number,
    semesterId: number,
    studentId: number,
    payload: { element?: unknown; content?: unknown }
  ): Promise<SaveNarrativeResult> {
    const schoolClass = await this.repository.findOwnedClass(classId, userId)
    const student = await this.repository.findStudentInClass(studentId, classId)
    if (!schoolClass || !student) return 'context_not_found'

    if (
      typeof payload.element !== 'string' ||
      typeof payload.content !== 'string' ||
      payload.content.trim().length === 0
    ) {
      return 'invalid_content'
    }

    await ReportNarrative.updateOrCreate(
      { studentId, semesterId, element: payload.element },
      {
        userId,
        classId,
        studentId,
        semesterId,
        element: payload.element,
        content: payload.content.trim(),
        status: 'draft',
      }
    )

    return 'saved'
  }

  async generateNarratives(
    userId: number,
    classId: number,
    semesterId: number
  ): Promise<GenerateNarrativesResult> {
    const schoolClass = await this.repository.findOwnedClass(classId, userId)
    if (!schoolClass) return { status: 'context_not_found' }

    const { jobId } = await GenerateNarratives.dispatch({
      userId,
      classId,
      semesterId,
    }).dedup({ id: `narratives:${userId}:${classId}:${semesterId}`, ttl: '5m' })

    return { status: 'queued', jobId }
  }

  async approveNarrative(narrativeId: string | number, userId: number) {
    const narrative = await this.repository.findOwnedNarrative(narrativeId, userId)
    if (!narrative) return false

    narrative.status = 'approved'
    narrative.approvedAt = DateTime.now()
    await narrative.save()
    return true
  }

  async computeClassReportCard(
    classId: number,
    semesterId: number,
    userId: number
  ): Promise<ClassReportCard> {
    const { students, rows } = await this.repository.getNumericReportData(
      classId,
      semesterId,
      userId
    )

    const byStudent = new Map<number, Map<string, number>>()
    for (const row of rows) {
      if (!byStudent.has(row.student_id)) byStudent.set(row.student_id, new Map())
      byStudent.get(row.student_id)!.set(row.subject, Number(row.average))
    }

    const subjects = Array.from(new Set(rows.map((row: NumericReportRow) => row.subject))).sort()
    const reports: StudentReport[] = students.map((student) => {
      const subjectMap = byStudent.get(student.id) ?? new Map<string, number>()
      const subjectAverages = subjects.map((subject) => ({
        subject,
        average: subjectMap.has(subject) ? subjectMap.get(subject)! : null,
      }))
      const values = subjectAverages
        .map((subject) => subject.average)
        .filter((value): value is number => value !== null)
      const overallAverage = values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
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

  async compileNarrativeReport(
    classId: number,
    semesterId: number,
    userId: number
  ): Promise<PaudStudentNarrative[]> {
    const { students, assessments, savedNarratives } = await this.repository.getNarrativeReportData(
      classId,
      semesterId,
      userId
    )

    const byStudent = new Map<number, typeof assessments>()
    for (const assessment of assessments) {
      if (!byStudent.has(assessment.studentId)) byStudent.set(assessment.studentId, [])
      byStudent.get(assessment.studentId)!.push(assessment)
    }

    const elements = [
      'Nilai Agama dan Budi Pekerti',
      'Jati Diri',
      'Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
    ]
    return students.map((student) => ({
      studentId: student.id,
      nis: student.nis,
      fullName: student.fullName,
      entries: (byStudent.get(student.id) ?? []).map((assessment) => ({
        type: assessment.type,
        typeLabel: PAUD_TYPE_LABELS[assessment.type] ?? assessment.type,
        date: assessment.date.toISODate() ?? '',
        content: assessment.content,
      })),
      narratives: elements.map((element) => {
        const saved = savedNarratives.find(
          (item) => item.studentId === student.id && item.element === element
        )
        return {
          id: saved?.id ?? null,
          element,
          content: saved?.content ?? '',
          status: saved?.status ?? 'draft',
        }
      }),
    }))
  }
}

export const reportCardService = new ReportCardService()

export async function computeClassReportCard(
  classId: number,
  semesterId: number,
  userId: number
): Promise<ClassReportCard> {
  return reportCardService.computeClassReportCard(classId, semesterId, userId)
}

export async function compileNarrativeReport(
  classId: number,
  semesterId: number,
  userId: number
): Promise<PaudStudentNarrative[]> {
  return reportCardService.compileNarrativeReport(classId, semesterId, userId)
}
