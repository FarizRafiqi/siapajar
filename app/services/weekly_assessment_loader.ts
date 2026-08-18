import PaudAssessment from '#models/paud_assessment'
import type WeeklyLessonPlan from '#models/weekly_lesson_plan'
import { parseAssessmentContent } from '#services/paud_assessment_export_service'

export const DEFAULT_IKTP_INDICATORS: string[] = [
  'Mengenal dan meniru doa-doa harian / kalimat toyyibah',
  'Mengenal dan mempraktikkan adab santun terhadap teman dan guru',
  'Menunjukkan rasa syukur atas ciptaan Allah melalui eksplorasi alam',
  'Mampu memperkenalkan diri dan menyebutkan anggota keluarga',
  'Menunjukkan kemandirian dalam merapikan alat dan perlengkapan',
  'Mengekspresikan emosi secara wajar dan mengenali perasaan teman',
  'Mampu menyimak dan menceritakan kembali cerita sederhana',
  'Mengenal konsep bilangan, bentuk, pola, dan ukuran benda di sekitar',
  'Menunjukkan koordinasi motorik halus saat meronce, menggunting, dan menempel',
  'Menunjukkan koordinasi motorik kasar saat gerak bebas dan bermain fisik',
  'Mampu membuat karya seni dari berbagai media loose parts dan bahan alam',
  'Mengekspresikan ide dan menyelesaikan tantangan bermain secara kreatif',
]

export interface AnecdoteItem {
  id: number
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

  if (!userId || !classId) {
    return formatLoadedAssessments([], weeklyPlan)
  }

  let query = PaudAssessment.query()
    .where('user_id', userId)
    .where('class_id', classId)
    .preload('student')
    .preload('attachments', (q) => q.orderBy('display_order', 'asc'))
    .orderBy('date', 'asc')

  // If weekStartDate is available, filter by week date range
  if (weeklyPlan.weekStartDate) {
    const startDate = weeklyPlan.weekStartDate.startOf('day')
    const endDate = startDate.plus({ days: 6 }).endOf('day')

    const dateFiltered = await query
      .clone()
      .where('date', '>=', startDate.toISODate()!)
      .where('date', '<=', endDate.toISODate()!)

    if (dateFiltered.length > 0) {
      return formatLoadedAssessments(dateFiltered, weeklyPlan)
    }
  }

  // Fallback: Query all assessments for this class and user
  const allAssessments = await query
  return formatLoadedAssessments(allAssessments, weeklyPlan)
}

function extractPlanIndicators(weeklyPlan: WeeklyLessonPlan): string[] {
  const rawIndicators = weeklyPlan.content?.assessment?.indicators
  if (Array.isArray(rawIndicators) && rawIndicators.length > 0) {
    return rawIndicators
      .map((i: any) => (typeof i === 'string' ? i : i?.indicator || ''))
      .filter((s: string) => s.trim().length > 0)
  }
  if (Array.isArray(weeklyPlan.content?.assessment?.iktpChecklist)) {
    return weeklyPlan.content.assessment.iktpChecklist
  }
  return []
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

function processChecklist(
  a: PaudAssessment,
  studentName: string,
  c: Record<string, any>,
  checklists: ChecklistItem[],
  iktpMap: Map<string, { sudah: boolean; belum: boolean; note: string }>
) {
  if (Array.isArray(c.items) && c.items.length > 0) {
    c.items.forEach((item) => {
      const ind = item.indicator || a.activity || '-'
      const isSudah = item.status === 'sudah_muncul'
      const isBelum = item.status === 'belum_muncul'
      checklists.push({
        no: checklists.length + 1,
        indicator: ind,
        sudahMuncul: isSudah,
        belumMuncul: isBelum,
        note: item.observationNote || item.event || a.teacherNote || '',
        studentName,
      })
      if (!iktpMap.has(ind)) {
        iktpMap.set(ind, {
          sudah: isSudah,
          belum: isBelum,
          note: item.observationNote || item.event || studentName,
        })
      }
    })
  } else {
    const ind = a.activity || c.context || 'Indikator Perkembangan'
    const isSudah =
      a.achievementStatus === 'sudah_muncul' ||
      a.achievementStatus === 'BSB' ||
      a.achievementStatus === 'BSH'
    const isBelum =
      a.achievementStatus === 'belum_muncul' ||
      a.achievementStatus === 'MB' ||
      a.achievementStatus === 'BB'
    checklists.push({
      no: checklists.length + 1,
      indicator: ind,
      sudahMuncul: isSudah,
      belumMuncul: isBelum,
      note: a.teacherNote || c.note || '',
      studentName,
    })
  }
}

function formatLoadedAssessments(
  assessments: PaudAssessment[],
  weeklyPlan: WeeklyLessonPlan
): LoadedWeeklyAssessments {
  const anecdotes: AnecdoteItem[] = []
  const checklists: ChecklistItem[] = []
  const workSamples: WorkSampleItem[] = []
  const photoSeries: PhotoSeriesItem[] = []

  const planIktp = extractPlanIndicators(weeklyPlan)
  const iktpMap = new Map<string, { sudah: boolean; belum: boolean; note: string }>()

  for (const a of assessments) {
    const c = parseAssessmentContent(a)
    const dateStr = a.date ? a.date.toFormat('dd/MM/yyyy') : '-'
    const studentName = a.student?.fullName || 'Siswa'

    switch (a.type) {
      case 'anecdotal_note':
        anecdotes.push(processAnecdote(a, dateStr, studentName, c))
        break
      case 'checklist':
        processChecklist(a, studentName, c, checklists, iktpMap)
        break
      case 'work_sample':
        workSamples.push(processWorkSample(a, dateStr, studentName, c))
        break
      case 'photo_series':
        photoSeries.push(processPhotoSeries(a, dateStr, studentName, c))
        break
    }
  }

  // If no checklist assessments filled, populate default indicators
  if (checklists.length === 0) {
    const listToUse = planIktp.length > 0 ? planIktp : DEFAULT_IKTP_INDICATORS
    listToUse.forEach((ind, idx) => {
      const match = iktpMap.get(ind)
      checklists.push({
        no: idx + 1,
        indicator: ind,
        sudahMuncul: match ? match.sudah : false,
        belumMuncul: match ? match.belum : false,
        note: match ? match.note : '',
      })
    })
  }

  const totalCount = anecdotes.length + checklists.length + workSamples.length + photoSeries.length

  return {
    anecdotes,
    checklists,
    workSamples,
    photoSeries,
    totalCount,
  }
}
