import type CurriculumPreset from '#models/curriculum_preset'

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

  const materials = String(act.toolsAndMaterials || act.materials || act.alatBahan || '').trim()
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

export function normalizeRpmContent(
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
