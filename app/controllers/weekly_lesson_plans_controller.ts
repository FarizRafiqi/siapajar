import type { HttpContext } from '@adonisjs/core/http'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import SchoolClass from '#models/school_class'
import CurriculumPreset from '#models/curriculum_preset'
import { updateWeeklyLessonPlanValidator } from '#validators/weekly_lesson_plan'
import { generateWeeklyLessonPlanValidator } from '#validators/generate'
import { AiServiceError } from '#services/ai_service'
import { rpmKbcRaPrompt } from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import LearningSequence from '#models/learning_sequence'
import { ensureDocumentWorkflow, saveDocumentWorkflow } from '#services/document_workflow_service'
import { exportWeeklyLessonPlan } from '#services/export_service'
import { exportWeeklyLessonPlanPdf } from '#services/pdf_export_service'
import { loadWeeklyPlanAssessments } from '#services/weekly_assessment_loader'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

function getNonEmptyArray<T>(...candidates: any[]): T[] {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate as T[]
    }
  }
  return []
}

function normalizeIdentification(
  idRaw: any,
  finalTheme: string,
  finalSubtheme: string,
  preset?: CurriculumPreset | null,
  rawRoot?: Record<string, any>
) {
  const studentCharacteristics =
    idRaw.students ||
    idRaw.studentCharacteristics ||
    rawRoot?.identification?.students ||
    'Peserta didik aktif, senang bereksplorasi secara sensorik-motorik, dan memiliki rasa ingin tahu yang tinggi.'

  const essentialMaterials =
    idRaw.essentialMaterials ||
    idRaw.essentialMaterial ||
    idRaw.learningMaterial ||
    rawRoot?.identification?.learningMaterial ||
    finalTheme

  const practicalMaterials =
    idRaw.practicalMaterials || idRaw.appliedMaterial || finalSubtheme || finalTheme

  const valueMaterials =
    idRaw.valueMaterials || idRaw.valueMaterial || 'Kasih sayang dan rasa syukur kepada Allah SWT'

  const presetDpl = (preset?.data?.dpl as string[]) || []
  const dpl = getNonEmptyArray<string>(idRaw.dpl, rawRoot?.dpl, presetDpl)

  const presetKbc = (preset?.data?.kbcValues as string[]) || []
  const kbcValues = getNonEmptyArray<string>(idRaw.kbcValues, rawRoot?.kbcValues, presetKbc)

  const pancaCintaValues = getNonEmptyArray<string>(idRaw.pancaCintaValues, kbcValues)

  return {
    studentCharacteristics,
    essentialMaterials,
    practicalMaterials,
    valueMaterials,
    dpl,
    kbcValues,
    pancaCintaValues,
  }
}

function extractLearningObjectives(rawLd: any): { code: string; title: string }[] {
  const rawObjectives = rawLd.learningObjectives || rawLd.tp || []
  if (Array.isArray(rawObjectives)) {
    return rawObjectives
      .map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return { code: `TP ${idx + 1}`, title: item }
        }
        return {
          code: item?.code || `TP ${idx + 1}`,
          title: item?.title || item?.name || item?.objective || '',
        }
      })
      .filter((tp) => Boolean(tp.title))
  }
  if (typeof rawObjectives === 'string' && rawObjectives.trim()) {
    return rawObjectives
      .split(/\.\s+|\n+/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((title: string, idx: number) => ({ code: `TP ${idx + 1}`, title }))
  }
  return []
}

function extractPedagogicalPractices(rawLd: any): {
  mindful: string
  meaningful: string
  joyful: string
} {
  if (typeof rawLd.pedagogicalPractices === 'object' && rawLd.pedagogicalPractices !== null) {
    return {
      mindful:
        rawLd.pedagogicalPractices.mindful ||
        'Fokus, kehadiran penuh, dan kesadaran diri saat beraktivitas.',
      meaningful:
        rawLd.pedagogicalPractices.meaningful ||
        'Bermakna, relevan dengan kehidupan anak dan lingkungan sekitar.',
      joyful:
        rawLd.pedagogicalPractices.joyful ||
        'Menyenangkan, penuh antusiasme, bermain sambil belajar.',
    }
  }
  let pedStr = ''
  if (typeof rawLd.pedagogicalPractice === 'string') {
    pedStr = rawLd.pedagogicalPractice
  } else if (typeof rawLd.pedagogicalPractices === 'string') {
    pedStr = rawLd.pedagogicalPractices
  }

  return {
    mindful: pedStr || 'Fokus, kehadiran penuh, dan kesadaran diri saat beraktivitas.',
    meaningful: pedStr || 'Bermakna, relevan dengan kehidupan anak dan lingkungan sekitar.',
    joyful: pedStr || 'Menyenangkan, penuh antusiasme, bermain sambil belajar.',
  }
}

function normalizeLearningDesign(ldRaw: any, rawRoot?: Record<string, any>) {
  const rawLd = Object.keys(ldRaw).length > 0 ? ldRaw : rawRoot?.learningDesign || {}
  const learningObjectives = extractLearningObjectives(rawLd)
  const pedagogicalPractices = extractPedagogicalPractices(rawLd)
  const cpElements =
    rawLd.cpElements ||
    (rawLd.cp
      ? [rawLd.cp]
      : ['Nilai Agama dan Budi Pekerti', 'Jati Diri', 'Dasar Literasi & STEAM'])

  return {
    cpElements,
    crossDisciplinaryConcepts:
      rawLd.crossDisciplinary ||
      rawLd.crossDisciplinaryConcepts ||
      'Agama Islam, Sains, Bahasa, Seni, Motorik',
    learningObjectives,
    pedagogicalPractices,
    partnerships:
      rawLd.partnership ||
      rawLd.partnerships ||
      'Melibatkan orang tua dalam penyediaan loose parts dan penguatan topik di rumah.',
    learningEnvironment:
      rawLd.environment ||
      rawLd.learningEnvironment ||
      'Area luar kelas, taman sekolah, serta media audio/visual ramah anak.',
    digitalIntegration:
      rawLd.digitalUtilization ||
      rawLd.digitalIntegration ||
      'Video pembelajaran interaktif dan media audio islami.',
  }
}

function extractLooseParts(d: any): string[] {
  if (Array.isArray(d.looseParts)) {
    return d.looseParts
  }
  if (typeof d.looseParts === 'string' && d.looseParts.trim()) {
    return d.looseParts
      .split(/[,;\n]+/)
      .map((s: string) => s.trim())
      .filter(Boolean)
  }
  if (typeof d.mediaLooseParts === 'string' && d.mediaLooseParts.trim()) {
    return d.mediaLooseParts
      .split(/[,;\n]+/)
      .map((s: string) => s.trim())
      .filter(Boolean)
  }
  if (Array.isArray(d.mediaLooseParts)) {
    return d.mediaLooseParts
  }
  return []
}

function extractActivityDetail(act: any, aIdx: number) {
  let actTitle = String(
    act.title || act.name || `Kegiatan ${act.activityNumber || aIdx + 1}`
  ).trim()
  let focus = act.focus ? String(act.focus).trim() : ''

  if (actTitle.endsWith(')')) {
    const lastOpenParen = actTitle.lastIndexOf('(')
    if (lastOpenParen !== -1) {
      if (!focus) {
        focus = actTitle.slice(lastOpenParen + 1, -1).trim()
      }
      actTitle = actTitle.slice(0, lastOpenParen).trim()
    }
  }

  let name = actTitle
  if (!/^Kegiatan\s+\d+/i.test(name)) {
    name = `Kegiatan ${act.activityNumber || aIdx + 1} : ${actTitle}`
  }

  let materials = String(act.toolsAndMaterials || act.materials || act.alatBahan || '').trim()
  let instructions = String(
    act.howToPlay || act.instructions || act.caraBermain || act.caraMembuat || ''
  ).trim()
  let benefits = String(act.benefits || act.manfaat || '').trim()

  if (!benefits && /Manfaat\s*:/i.test(instructions)) {
    const parts = instructions.split(/Manfaat\s*:\s*/i)
    instructions = parts[0].trim()
    benefits = parts[1]?.trim() || ''
  }

  return {
    name,
    focus,
    materials,
    instructions,
    benefits,
  }
}

function normalizeDayActivities(
  d: any,
  idx: number,
  finalTheme: string,
  days: string[],
  stageLabels: string[]
) {
  let day = ''
  if (typeof d.day === 'number') {
    day = days[d.day - 1] || `Hari ${d.day}`
  } else if (typeof d.day === 'string' && d.day.trim()) {
    day = d.day.trim()
  } else {
    day = days[idx] || `Hari ${idx + 1}`
  }

  const stage = d.phase || d.stage || stageLabels[idx] || 'MEMAHAMI (BERKESADARAN, BERMAKNA)'

  let rawActs: any[] = []
  if (Array.isArray(d.activities)) {
    rawActs = d.activities
  } else if (typeof d.activities === 'string' && d.activities.trim()) {
    rawActs = d.activities
      .split(/\n+/)
      .map((s: string) => s.trim().replace(/^[-*•0-9.]+\s*/, ''))
      .filter(Boolean)
  }

  const looseParts = extractLooseParts(d)

  let activitiesDetail: any[] = []
  if (Array.isArray(d.activitiesDetail) && d.activitiesDetail.length > 0) {
    activitiesDetail = d.activitiesDetail
  } else if (rawActs.length > 0 && typeof rawActs[0] === 'object') {
    activitiesDetail = rawActs.map((act: any, aIdx: number) => extractActivityDetail(act, aIdx))
  }

  const simpleActivities =
    activitiesDetail.length > 0
      ? activitiesDetail.map((a: any) => (a.focus ? `${a.name} (${a.focus})` : a.name))
      : rawActs.map((a: any) => (typeof a === 'string' ? a : a.title || a.name || ''))

  const firstActName = activitiesDetail[0]?.name || ''
  const fallbackTitle = firstActName
    ? firstActName.replace(/^Kegiatan\s+\d+\s*:\s*/i, '')
    : `Eksplorasi ${finalTheme}`

  return {
    day,
    stage,
    title: d.title || fallbackTitle,
    activities: simpleActivities,
    activitiesDetail,
    looseParts,
    steamFocus: d.steamFocus || d.kbcFocus || d.kbcImplementation || undefined,
  }
}

function normalizeLearningExperience(
  expRaw: any,
  finalTheme: string,
  rawRoot?: Record<string, any>
) {
  const openingActivities = getNonEmptyArray<string>(
    expRaw.openingActivities,
    rawRoot?.openingActivities
  )
  const openingQuestions = getNonEmptyArray<string>(
    expRaw.openingQuestions,
    rawRoot?.openingQuestions
  )
  const closingActivities = getNonEmptyArray<string>(
    expRaw.closingActivities,
    rawRoot?.closingActivities
  )

  const rawDaily = getNonEmptyArray<any>(
    expRaw.dailyCoreActivities,
    expRaw.coreDays,
    rawRoot?.dailyCoreActivities,
    rawRoot?.coreDays
  )

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
  const stageLabels = [
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MENGAPLIKASIKAN (BERKESADARAN, BERMAKNA)',
    'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
  ]

  const items = rawDaily.length > 0 ? rawDaily : days.map((d) => ({ day: d }))
  const dailyCoreActivities = items.map((d: any, idx: number) =>
    normalizeDayActivities(d, idx, finalTheme, days, stageLabels)
  )

  return {
    openingActivities,
    openingQuestions,
    dailyCoreActivities,
    closingActivities,
  }
}

function extractAnecdotes(rawAsm: any) {
  if (!Array.isArray(rawAsm.anecdotes)) return undefined
  return rawAsm.anecdotes
    .map((anec: any) => ({
      studentName: String(anec.studentName || '').trim(),
      date: String(anec.date || '').trim(),
      event: String(anec.event || '').trim(),
      analysis: String(anec.analysis || '').trim(),
    }))
    .filter((a: any) => a.studentName && a.event)
}

function extractStudentChecklists(rawAsm: any) {
  if (!Array.isArray(rawAsm.studentChecklists)) return undefined
  return rawAsm.studentChecklists
    .map((sc: any) => ({
      studentName: String(sc.studentName || '').trim(),
      items: Array.isArray(sc.items)
        ? sc.items.map((it: any, itIdx: number) => ({
            no: it.no || itIdx + 1,
            indicator: String(it.indicator || '').trim(),
            sudahMuncul: it.sudahMuncul !== false,
            belumMuncul: Boolean(it.belumMuncul),
            note: String(it.note || '').trim(),
          }))
        : [],
    }))
    .filter((sc: any) => sc.studentName && sc.items.length > 0)
}

function normalizeAssessment(asmRaw: any, rawRoot?: Record<string, any>) {
  const rawAsm = Object.keys(asmRaw).length > 0 ? asmRaw : rawRoot?.assessment || {}
  const rawTechs = rawAsm.assessmentTechniques ||
    rawAsm.techniques ||
    rawRoot?.assessmentSteps || ['Catatan Anekdot', 'Hasil Karya', 'Foto Berseri', 'Ceklis IKTP']
  const assessmentTechniques = Array.isArray(rawTechs) ? rawTechs : [rawTechs]

  const rawIndicators = getNonEmptyArray<any>(
    rawAsm.indicators,
    rawRoot?.iktpChecklist,
    rawRoot?.iktpItems
  )
  const indicators = rawIndicators
    .map((ind: any) => {
      if (typeof ind === 'string') {
        return { indicator: ind }
      }
      return { indicator: ind?.indicator || ind?.title || ind?.name || '' }
    })
    .filter((i) => Boolean(i.indicator))

  const earlyAssessment = getNonEmptyArray<string>(rawAsm.earlyAssessment, rawRoot?.earlyAssessment)
  const processAssessment = getNonEmptyArray<string>(
    rawAsm.processAssessment,
    rawRoot?.processAssessment
  )
  const finalAssessment = getNonEmptyArray<string>(rawAsm.finalAssessment, rawRoot?.finalAssessment)

  let iktpChecklist: string[] = []
  if (Array.isArray(rawAsm.iktpChecklist) && rawAsm.iktpChecklist.length > 0) {
    iktpChecklist = rawAsm.iktpChecklist
  } else if (Array.isArray(rawRoot?.iktpChecklist) && rawRoot!.iktpChecklist.length > 0) {
    iktpChecklist = rawRoot!.iktpChecklist
  } else if (Array.isArray(rawRoot?.iktpItems) && rawRoot!.iktpItems.length > 0) {
    iktpChecklist = rawRoot!.iktpItems.map((item: any) =>
      typeof item === 'string' ? item : item.indicator
    )
  } else {
    iktpChecklist = indicators.map((i) => i.indicator)
  }

  const anecdotes = extractAnecdotes(rawAsm)
  const studentChecklists = extractStudentChecklists(rawAsm)

  return {
    assessmentTechniques,
    indicators,
    earlyAssessment,
    processAssessment,
    finalAssessment,
    iktpChecklist,
    anecdotes,
    studentChecklists,
  }
}

function normalizeRpmContent(
  raw: Record<string, any>,
  defaults: {
    finalTheme: string
    finalSubtheme: string
    computedSemester: number
    computedWeek: number
    groupName: string
    preset?: CurriculumPreset | null
    curriculum?: any
  }
): Record<string, any> {
  const {
    finalTheme,
    finalSubtheme,
    computedSemester,
    computedWeek,
    groupName,
    preset,
    curriculum,
  } = defaults

  const topic = raw.topic || raw.theme || finalTheme
  const subtheme = raw.subtheme || raw.subtopic || finalSubtheme

  return {
    ...raw,
    theme: topic,
    topic,
    subtheme,
    subtopic: subtheme,
    semester: raw.semester || computedSemester,
    weekNumber: raw.weekNumber || computedWeek,
    groupContext: raw.groupContext || groupName,
    allocation: raw.allocation || raw.timeAllocation || '5 Hari x 180 Menit (15 JP)',
    identification: normalizeIdentification(raw.identification || {}, topic, subtheme, preset, raw),
    learningDesign: normalizeLearningDesign(raw.learningDesign || {}, raw),
    learningExperience: normalizeLearningExperience(raw.learningExperience || {}, topic, raw),
    assessment: normalizeAssessment(raw.assessment || {}, raw),
    nilaiAgamaBudiPekerti: Array.isArray(raw.nilaiAgamaBudiPekerti)
      ? raw.nilaiAgamaBudiPekerti
      : [],
    jatiDiri: Array.isArray(raw.jatiDiri) ? raw.jatiDiri : [],
    literasiSainsTeknologi: Array.isArray(raw.literasiSainsTeknologi)
      ? raw.literasiSainsTeknologi
      : [],
    rencanaKegiatan: Array.isArray(raw.rencanaKegiatan) ? raw.rencanaKegiatan : [],
    curriculum: curriculum || raw.curriculum,
  }
}

export default class WeeklyLessonPlansController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlans = await WeeklyLessonPlan.query()
      .where('user_id', user.id)
      .preload('schoolClass')
      .orderBy('week_start_date', 'desc')

    const classes = await SchoolClass.query().where('user_id', user.id).orderBy('name')
    const sequences = await LearningSequence.query().where('user_id', user.id).orderBy('title')

    const currentMonth = new Date().getMonth() + 1
    const defaultSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

    const presets = await CurriculumPreset.query()
      .where('education_level', 'tk')
      .where('is_active', true)
      .orderBy('semester', 'asc')
      .orderBy('sort_order', 'asc')
      .orderBy('week_number', 'asc')

    return inertia.render('dashboard/weekly-lesson-plans/index', {
      weeklyLessonPlans: weeklyLessonPlans.map((p) => p.toJSON()),
      classes: classes.map((c) => c.toJSON()),
      sequences: sequences.map((s) => s.toJSON()),
      presets: presets.map((p) => p.toJSON()),
      defaultSemester,
    })
  }

  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    const rawContent = weeklyLessonPlan.content || {}
    const finalTheme = rawContent.topic || rawContent.theme || weeklyLessonPlan.theme
    const finalSubtheme = rawContent.subtopic || rawContent.subtheme || ''

    const normalizedContent = normalizeRpmContent(rawContent, {
      finalTheme,
      finalSubtheme,
      computedSemester: rawContent.semester || 1,
      computedWeek: rawContent.weekNumber || 1,
      groupName: weeklyLessonPlan.schoolClass?.name || 'Kelompok B',
    })

    const workflow = await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id, {
      status: weeklyLessonPlan.status,
    })

    const assessments = await loadWeeklyPlanAssessments(weeklyLessonPlan)

    const planJson = weeklyLessonPlan.toJSON()
    planJson.content = normalizedContent

    return inertia.render('dashboard/weekly-lesson-plans/show', {
      weeklyLessonPlan: planJson,
      workflow: workflow.toJSON(),
      assessments,
    })
  }

  async export({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const plan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()
    if (!plan) return response.redirect('/rppm')

    const rawContent = plan.content || {}
    const finalTheme = rawContent.topic || rawContent.theme || plan.theme
    const finalSubtheme = rawContent.subtopic || rawContent.subtheme || ''
    plan.content = normalizeRpmContent(rawContent, {
      finalTheme,
      finalSubtheme,
      computedSemester: rawContent.semester || 1,
      computedWeek: rawContent.weekNumber || 1,
      groupName: plan.schoolClass?.name || 'Kelompok B',
    })

    const assessments = await loadWeeklyPlanAssessments(plan)
    const buffer = await exportWeeklyLessonPlan(plan, user, true, assessments)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(['Modul_Ajar_RPM', plan.theme], 'docx')
    )
  }

  async exportPdf({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const plan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('schoolClass')
      .first()
    if (!plan) return response.redirect('/rppm')

    const rawContent = plan.content || {}
    const finalTheme = rawContent.topic || rawContent.theme || plan.theme
    const finalSubtheme = rawContent.subtopic || rawContent.subtheme || ''
    plan.content = normalizeRpmContent(rawContent, {
      finalTheme,
      finalSubtheme,
      computedSemester: rawContent.semester || 1,
      computedWeek: rawContent.weekNumber || 1,
      groupName: plan.schoolClass?.name || 'Kelompok B',
    })

    const assessments = await loadWeeklyPlanAssessments(plan)
    const buffer = await exportWeeklyLessonPlanPdf(
      plan,
      user,
      !wantsInlinePreview(request),
      assessments
    )
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(['Modul_Ajar_RPM', plan.theme], 'pdf'),
      { inline: wantsInlinePreview(request) }
    )
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    const data = await request.validateUsing(updateWeeklyLessonPlanValidator)
    await weeklyLessonPlan.merge(data).save()
    const workflow = await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id)
    await saveDocumentWorkflow(workflow, data.status as 'draft' | 'published' | undefined)

    session.flash('success', 'Modul Ajar (RPM) berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const weeklyLessonPlan = await WeeklyLessonPlan.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!weeklyLessonPlan) {
      return response.redirect('/rppm')
    }

    await weeklyLessonPlan.delete()

    session.flash('success', 'Modul Ajar (RPM) berhasil dihapus')
    return response.redirect().toRoute('rppm.index')
  }

  async generate({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const {
      classId,
      theme,
      subtheme,
      weekStartDate,
      semester,
      weekNumber,
      presetId,
      learningSequenceId,
    } = await request.validateUsing(generateWeeklyLessonPlanValidator)

    const schoolClass = await SchoolClass.query()
      .where('id', classId)
      .where('user_id', user.id)
      .preload('students')
      .first()

    if (!schoolClass) {
      session.flash('error', 'Kelompok / Kelas tidak ditemukan')
      return response.redirect().back()
    }

    let preset: CurriculumPreset | null = null
    if (presetId) {
      preset = await CurriculumPreset.find(presetId)
    }

    const currentMonth = new Date().getMonth() + 1
    const computedSemester =
      semester ?? preset?.semester ?? (currentMonth >= 7 && currentMonth <= 12 ? 1 : 2)
    const computedWeek = weekNumber ?? preset?.weekNumber ?? 1
    const finalTheme = theme || preset?.themeTitle || 'Aku Hamba Allah'
    const finalSubtheme = subtheme || preset?.subthemeTitle || ''
    const studentNames = (schoolClass.students || []).map((s) => s.fullName).filter(Boolean)

    const curriculum = await getCurriculumContext(user.id, learningSequenceId)
    let content: Record<string, any>
    try {
      const prompt = rpmKbcRaPrompt({
        theme: finalTheme,
        subtheme: finalSubtheme || undefined,
        semester: computedSemester,
        weekNumber: computedWeek,
        groupName: schoolClass.name,
        schoolName: user.schoolName || undefined,
        teacherName: user.fullName || undefined,
        studentNames: studentNames.length > 0 ? studentNames : undefined,
        dplSuggestions: (preset?.data?.dpl as string[]) || undefined,
        kbcSuggestions: (preset?.data?.kbcValues as string[]) || undefined,
        loosePartsSuggestions: (preset?.data?.loosePartsSuggestions as string[]) || undefined,
        curriculumContext: {
          objectives: curriculum.objectives,
        },
      })

      const raw = await callAiJsonForUser<Record<string, any>>(user, {
        combo: 'siapajar-docgen',
        systemPrompt: prompt.system,
        userPrompt: prompt.user,
      })

      content = normalizeRpmContent(raw, {
        finalTheme,
        finalSubtheme,
        computedSemester,
        computedWeek,
        groupName: schoolClass.name,
        preset,
        curriculum,
      })
    } catch (error) {
      session.flash(
        'error',
        error instanceof AiServiceError
          ? error.message
          : 'Gagal generate Modul Ajar (RPM). Coba lagi.'
      )
      return response.redirect().back()
    }

    const weeklyLessonPlan = await WeeklyLessonPlan.create({
      userId: user.id,
      classId,
      theme: finalTheme,
      weekStartDate,
      content,
      status: 'draft',
    })
    await ensureDocumentWorkflow(user.id, 'rppm', weeklyLessonPlan.id, { status: 'draft' })

    session.flash('success', 'Modul Ajar (RPM KBC RA) berhasil dibuat!')
    return response.redirect().toRoute('rppm.show', { id: weeklyLessonPlan.id })
  }
}
