import type PaudAssessment from '#models/paud_assessment'
import type Student from '#models/student'
import type WeeklyLessonPlan from '#models/weekly_lesson_plan'
import { weeklyAssessmentRepository } from '#repositories/weekly_assessment_repository'
import { parseAssessmentContent } from '#services/paud_assessment_export_service'

export interface AnecdoteItem {
  id?: number
  date: string
  studentName: string
  event: string
  analysis: string
}

export interface ChecklistItem {
  no: number
  indicator: string
  sudahMuncul: boolean
  belumMuncul: boolean
  note: string
  studentName?: string
}

export interface StudentChecklistGroup {
  studentId?: number
  studentName: string
  items: ChecklistItem[]
}

export interface WorkSampleItem {
  id: number
  date: string
  studentName: string
  description: string
  analysis: string
  attachmentId?: number
  attachmentUrl?: string
  storedName?: string
}

export interface PhotoSeriesItem {
  id: number
  date: string
  studentName: string
  description: string
  analysis: string
  attachments: Array<{
    id: number
    url?: string
    storedName?: string
  }>
}

export interface LoadedWeeklyAssessments {
  anecdotes: AnecdoteItem[]
  checklists: ChecklistItem[]
  studentChecklists: StudentChecklistGroup[]
  workSamples: WorkSampleItem[]
  photoSeries: PhotoSeriesItem[]
  totalCount: number
}

/**
 * Loads and structures PAUD assessments associated with a weekly lesson plan (RPM)
 */
export async function loadWeeklyPlanAssessments(
  weeklyPlan: WeeklyLessonPlan
): Promise<LoadedWeeklyAssessments> {
  const userId = weeklyPlan.userId
  const classId = weeklyPlan.classId
  const { classStudents, assessments } = await weeklyAssessmentRepository.findForWeeklyPlan(
    userId,
    classId,
    weeklyPlan.weekStartDate
  )

  return formatLoadedAssessments(assessments, weeklyPlan, classStudents)
}

function processAnecdote(
  a: PaudAssessment,
  dateStr: string,
  studentName: string,
  c: Record<string, any>
): AnecdoteItem {
  return {
    id: a.id,
    date: dateStr,
    studentName,
    event: c.observedEvent || c.behavior || a.activity || a.teacherNote || '-',
    analysis: c.achievementAnalysis || c.analysis || a.teacherNote || '-',
  }
}

function processWorkSample(
  a: PaudAssessment,
  dateStr: string,
  studentName: string,
  c: Record<string, any>
): WorkSampleItem {
  const firstAtt = a.attachments?.[0]
  return {
    id: a.id,
    date: dateStr,
    studentName,
    description: c.workDescription || c.description || c.narrative || a.activity || '-',
    analysis: c.achievementAnalysis || c.analysis || a.teacherNote || '-',
    attachmentId: firstAtt?.id,
    attachmentUrl: firstAtt
      ? `/paud-assessments/${a.id}/attachments/${firstAtt.id}`
      : a.evidenceUrl || undefined,
    storedName: firstAtt?.storedName,
  }
}

function processPhotoSeries(
  a: PaudAssessment,
  dateStr: string,
  studentName: string,
  c: Record<string, any>
): PhotoSeriesItem {
  return {
    id: a.id,
    date: dateStr,
    studentName,
    description: c.activityTitle || c.description || c.narrative || a.activity || '-',
    analysis: c.achievementAnalysis || c.analysis || a.teacherNote || '-',
    attachments: (a.attachments || []).map((att) => ({
      id: att.id,
      url: `/paud-assessments/${a.id}/attachments/${att.id}`,
      storedName: att.storedName,
    })),
  }
}

function formatLoadedAssessments(
  assessments: PaudAssessment[],
  weeklyPlan: WeeklyLessonPlan,
  _classStudents: Student[] = []
): LoadedWeeklyAssessments {
  const anecdotes: AnecdoteItem[] = []
  const rawChecklists: ChecklistItem[] = []
  const studentChecklistMap = new Map<
    string,
    { studentId?: number; studentName: string; items: ChecklistItem[] }
  >()
  const workSamples: WorkSampleItem[] = []
  const photoSeries: PhotoSeriesItem[] = []

  for (const a of assessments) {
    const c = parseAssessmentContent(a)
    const dateStr = a.date ? a.date.toFormat('dd/MM/yyyy') : '-'
    const studentName = a.student?.fullName || 'Siswa'
    const studentId = a.studentId || undefined

    switch (a.type) {
      case 'anecdotal_note':
        anecdotes.push(processAnecdote(a, dateStr, studentName, c))
        break
      case 'checklist': {
        if (!studentChecklistMap.has(studentName)) {
          studentChecklistMap.set(studentName, {
            studentId,
            studentName,
            items: [],
          })
        }
        const group = studentChecklistMap.get(studentName)!

        if (Array.isArray(c.items) && c.items.length > 0) {
          c.items.forEach((item: any) => {
            const ind = item.indicator || a.activity || '-'
            const statusStr = String(item.status || '').toLowerCase()
            const isSudah =
              statusStr === 'sudah_muncul' ||
              !item.status ||
              statusStr === 'bsb' ||
              statusStr === 'bsh'
            const isBelum = statusStr === 'belum_muncul' || statusStr === 'mb' || statusStr === 'bb'
            const note = item.observationNote || item.event || a.teacherNote || c.note || '-'
            const checkItem: ChecklistItem = {
              no: group.items.length + 1,
              indicator: ind,
              sudahMuncul: isSudah,
              belumMuncul: isBelum,
              note,
              studentName,
            }
            group.items.push(checkItem)
            rawChecklists.push(checkItem)
          })
        } else {
          const ind = a.activity || c.context || 'Indikator Perkembangan'
          const isSudah =
            a.achievementStatus === 'sudah_muncul' ||
            a.achievementStatus === 'BSB' ||
            a.achievementStatus === 'BSH' ||
            !a.achievementStatus
          const isBelum =
            a.achievementStatus === 'belum_muncul' ||
            a.achievementStatus === 'MB' ||
            a.achievementStatus === 'BB'
          const note = a.teacherNote || c.note || '-'
          const checkItem: ChecklistItem = {
            no: group.items.length + 1,
            indicator: ind,
            sudahMuncul: isSudah,
            belumMuncul: isBelum,
            note,
            studentName,
          }
          group.items.push(checkItem)
          rawChecklists.push(checkItem)
        }
        break
      }
      case 'work_sample':
        workSamples.push(processWorkSample(a, dateStr, studentName, c))
        break
      case 'photo_series':
        photoSeries.push(processPhotoSeries(a, dateStr, studentName, c))
        break
    }
  }

  // If no checklists exist in DB, check AI generated plan content
  const studentChecklists: StudentChecklistGroup[] = Array.from(studentChecklistMap.values())

  if (studentChecklists.length === 0) {
    const aiChecklists = weeklyPlan.content?.assessment?.studentChecklists
    if (Array.isArray(aiChecklists) && aiChecklists.length > 0) {
      for (const group of aiChecklists) {
        const items: ChecklistItem[] = (group.items || []).map((it: any, idx: number) => ({
          no: it.no || idx + 1,
          indicator: it.indicator || `Indikator ${idx + 1}`,
          sudahMuncul: it.sudahMuncul !== false,
          belumMuncul: Boolean(it.belumMuncul),
          note: it.note || '-',
          studentName: group.studentName,
        }))
        studentChecklists.push({
          studentName: group.studentName,
          items,
        })
        rawChecklists.push(...items)
      }
    }
  }

  // If anecdotes are empty in DB, check AI generated plan content
  if (anecdotes.length === 0) {
    const aiAnecdotes = weeklyPlan.content?.assessment?.anecdotes
    if (Array.isArray(aiAnecdotes) && aiAnecdotes.length > 0) {
      for (const anec of aiAnecdotes) {
        anecdotes.push({
          date: anec.date || '-',
          studentName: anec.studentName || '-',
          event: anec.event || '-',
          analysis: anec.analysis || '-',
        })
      }
    }
  }

  const totalCount =
    anecdotes.length + rawChecklists.length + workSamples.length + photoSeries.length

  return {
    anecdotes,
    checklists: rawChecklists,
    studentChecklists,
    workSamples,
    photoSeries,
    totalCount,
  }
}
