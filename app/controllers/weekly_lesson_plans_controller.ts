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

function normalizeIdentification(
  idRaw: any,
  finalTheme: string,
  finalSubtheme: string,
  preset?: CurriculumPreset | null
) {
  const studentCharacteristics =
    idRaw.studentCharacteristics ||
    'Peserta didik aktif, senang bereksplorasi secara sensorik-motorik, dan memiliki rasa ingin tahu yang tinggi.'
  const essentialMaterials = idRaw.essentialMaterials || idRaw.essentialMaterial || finalTheme
  const practicalMaterials =
    idRaw.practicalMaterials || idRaw.appliedMaterial || finalSubtheme || finalTheme
  const valueMaterials =
    idRaw.valueMaterials || idRaw.valueMaterial || 'Kasih sayang dan rasa syukur kepada Allah SWT'
  const dpl =
    Array.isArray(idRaw.dpl) && idRaw.dpl.length > 0
      ? idRaw.dpl
      : (preset?.data?.dpl as string[]) || [
          'DPL 1: Keimanan & Ketakwaan',
          'DPL 3: Penalaran Kritis',
        ]
  const kbcValues =
    Array.isArray(idRaw.kbcValues) && idRaw.kbcValues.length > 0
      ? idRaw.kbcValues
      : (preset?.data?.kbcValues as string[]) || ['Cinta Alloh & RosulNya', 'Cinta Diri & Sesama']
  const pancaCintaValues =
    Array.isArray(idRaw.pancaCintaValues) && idRaw.pancaCintaValues.length > 0
      ? idRaw.pancaCintaValues
      : ['Cinta Alloh & RosulNya', 'Cinta Diri & Sesama', 'Cinta Lingkungan']

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

function normalizeLearningDesign(ldRaw: any, finalTheme: string) {
  const rawObjectives = ldRaw.learningObjectives || []
  const learningObjectives = (Array.isArray(rawObjectives) ? rawObjectives : [rawObjectives])
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

  let pedagogicalPractices: { mindful: string; meaningful: string; joyful: string }
  if (typeof ldRaw.pedagogicalPractices === 'object' && ldRaw.pedagogicalPractices !== null) {
    pedagogicalPractices = {
      mindful:
        ldRaw.pedagogicalPractices.mindful ||
        'Fokus, kehadiran penuh, dan kesadaran diri saat beraktivitas.',
      meaningful:
        ldRaw.pedagogicalPractices.meaningful ||
        'Bermakna, relevan dengan kehidupan anak dan lingkungan sekitar.',
      joyful:
        ldRaw.pedagogicalPractices.joyful ||
        'Menyenangkan, penuh antusiasme, bermain sambil belajar.',
    }
  } else {
    const pedStr = typeof ldRaw.pedagogicalPractices === 'string' ? ldRaw.pedagogicalPractices : ''
    pedagogicalPractices = {
      mindful: pedStr || 'Fokus, kehadiran penuh, dan kesadaran diri saat beraktivitas.',
      meaningful: pedStr || 'Bermakna, relevan dengan kehidupan anak dan lingkungan sekitar.',
      joyful: pedStr || 'Menyenangkan, penuh antusiasme, bermain sambil belajar.',
    }
  }

  return {
    cpElements: ldRaw.cpElements || [
      'Nilai Agama dan Budi Pekerti',
      'Jati Diri',
      'Dasar Literasi & STEAM',
    ],
    crossDisciplinaryConcepts:
      ldRaw.crossDisciplinary ||
      ldRaw.crossDisciplinaryConcepts ||
      'Agama Islam, Sains, Bahasa, Seni, Motorik',
    learningObjectives:
      learningObjectives.length > 0
        ? learningObjectives
        : [
            { code: 'TP 1', title: `Anak mengenal dan mengeksplorasi konsep ${finalTheme}` },
            { code: 'TP 2', title: 'Anak mampu berkreasi dengan bahan alam dan loose parts' },
          ],
    pedagogicalPractices,
    partnerships:
      ldRaw.partnerships ||
      'Melibatkan orang tua dalam penyediaan loose parts dan penguatan topik di rumah.',
    learningEnvironment:
      ldRaw.learningEnvironment ||
      'Area luar kelas, taman sekolah, serta media audio/visual ramah anak.',
    digitalIntegration:
      ldRaw.digitalUtilization ||
      ldRaw.digitalIntegration ||
      'Video pembelajaran interaktif dan media audio islami.',
  }
}

function normalizeLearningExperience(expRaw: any, finalTheme: string) {
  const openingActivities =
    Array.isArray(expRaw.openingActivities) && expRaw.openingActivities.length > 0
      ? expRaw.openingActivities
      : [
          'Salam dan doa pembuka dengan penuh kesadaran',
          'Renungan/nasehat/motivasi pagi yang bermakna',
          'Menyanyikan lagu ceria tentang tema pembelajaran',
          'Asesmen awal melalui diskusi ide kegiatan hari ini',
          'Kegiatan pemantik berupa cerita / tayangan video interaktif',
          'Menyiapkan kesepakatan kelas dan aturan bermain',
          'Pertanyaan pemantik untuk mengembangkan dimensi profil lulusan',
        ]

  const openingQuestions =
    Array.isArray(expRaw.openingQuestions) && expRaw.openingQuestions.length > 0
      ? expRaw.openingQuestions
      : [
          'Siapa yang bisa menceritakan pengalamannya tentang tema ini dengan suara jelas? (Komunikasi)',
          'Apa yang membuat dirimu dan ciptaan Tuhan ini istimewa? (Keimanan & Ketakwaan)',
          'Bagaimana cara kita menghargai dan bekerja sama dengan teman? (Kewargaan & Kolaborasi)',
          'Apa yang bisa kamu lakukan secara mandiri hari ini? (Kemandirian)',
        ]

  const closingActivities =
    Array.isArray(expRaw.closingActivities) && expRaw.closingActivities.length > 0
      ? expRaw.closingActivities
      : [
          'Recalling kegiatan hari ini: "Apa yang paling menyenangkan hari ini?"',
          'Pameran mini hasil karya dimana setiap anak memamerkan karyanya dengan bangga',
          'Tepuk tangan apresiasi bersama untuk semua pencapaian anak hari ini',
          'Bernyanyi lagu penutup yang ceria tentang kebanggaan diri',
          'Yel-yel semangat untuk kegiatan esok hari',
          'Doa penutup dengan penuh rasa syukur dan persiapan pulang yang gembira',
        ]

  const rawDaily = Array.isArray(expRaw.dailyCoreActivities) ? expRaw.dailyCoreActivities : []
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
  const stageLabels = [
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MEMAHAMI (BERKESADARAN, BERMAKNA)',
    'MENGAPLIKASIKAN (BERKESADARAN, BERMAKNA)',
    'MEREFLEKSI (BERKESADARAN, BERMAKNA)',
  ]

  const dailyCoreActivities = (rawDaily.length > 0 ? rawDaily : days.map((d) => ({ day: d }))).map(
    (d: any, idx: number) => {
      const day = d.day || days[idx] || `Hari ${idx + 1}`
      const stage = d.stage || stageLabels[idx] || 'MEMAHAMI (BERKESADARAN, BERMAKNA)'
      const title = d.title || `Eksplorasi Kreatif ${finalTheme}`

      let activities: string[] = []
      if (Array.isArray(d.activities)) {
        activities = d.activities
      } else if (typeof d.activities === 'string' && d.activities.trim()) {
        activities = d.activities
          .split(/\n+/)
          .map((s: string) => s.trim().replace(/^[-*•0-9.]+\s*/, ''))
          .filter(Boolean)
      }

      let looseParts: string[] = []
      if (Array.isArray(d.looseParts)) {
        looseParts = d.looseParts
      } else if (typeof d.looseParts === 'string' && d.looseParts.trim()) {
        looseParts = d.looseParts
          .split(/[,;\n]+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      } else if (typeof d.mediaLooseParts === 'string' && d.mediaLooseParts.trim()) {
        looseParts = d.mediaLooseParts
          .split(/[,;\n]+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      } else if (Array.isArray(d.mediaLooseParts)) {
        looseParts = d.mediaLooseParts
      }

      const activitiesDetail =
        Array.isArray(d.activitiesDetail) && d.activitiesDetail.length > 0
          ? d.activitiesDetail
          : [
              {
                name: `Kegiatan 1 : Eksplorasi Sensori & Motorik ${finalTheme}`,
                focus: 'Kesehatan & Motorik Halus',
                materials: 'Bahan alam, loose parts, matras, dan media ramah anak',
                instructions: `Anak diajak bereksplorasi sensorik dan mengamati benda-benda terkait ${finalTheme}.`,
                benefits: 'Meningkatkan koordinasi sensori-motorik dan konsentrasi anak.',
              },
              {
                name: `Kegiatan 2 : Kreasi Seni & Kolaborasi ${finalTheme}`,
                focus: 'Kreativitas & Kolaborasi',
                materials: 'Kertas karton, lem, kancing warna, daun kering, dan balok',
                instructions:
                  'Anak menyusun loose parts membentuk kreasi karya sesuai imajinasi mereka.',
                benefits: 'Mengembangkan daya imajinasi, estetika, dan interaksi sosial.',
              },
              {
                name: `Kegiatan 3 : Tantangan Logika & Komunikasi`,
                focus: 'Penalaran Kritis & Komunikasi',
                materials: 'Kartu gambar, tutup botol berangka, dan benda sekitar',
                instructions:
                  'Anak memecahkan teka-teki sederhana dan menceritakan hasilnya kepada teman.',
                benefits:
                  'Melatih kemampuan berpikir kritis, numerasi awal, dan rasa percaya diri.',
              },
            ]

      return {
        day,
        stage,
        title,
        activities:
          activities.length > 0
            ? activities
            : activitiesDetail.map((a: any) => `${a.name} (${a.focus})`),
        activitiesDetail,
        looseParts:
          looseParts.length > 0
            ? looseParts
            : ['Bahan alam (daun/ranting/batu)', 'Balok kayu', 'Tutup botol', 'Kardus daur ulang'],
        steamFocus: d.steamFocus || d.kbcFocus || undefined,
      }
    }
  )

  return {
    openingActivities,
    openingQuestions,
    dailyCoreActivities,
    closingActivities,
  }
}

function normalizeAssessment(asmRaw: any, finalTheme: string) {
  const rawTechs = asmRaw.assessmentTechniques ||
    asmRaw.techniques || ['Catatan Anekdot', 'Hasil Karya', 'Foto Berseri', 'Ceklis IKTP']
  const assessmentTechniques = Array.isArray(rawTechs) ? rawTechs : [rawTechs]

  const rawIndicators = asmRaw.indicators || []
  const indicators = (Array.isArray(rawIndicators) ? rawIndicators : [rawIndicators])
    .map((ind: any) => {
      if (typeof ind === 'string') {
        return { indicator: ind }
      }
      return { indicator: ind?.indicator || ind?.title || ind?.name || '' }
    })
    .filter((i) => Boolean(i.indicator))

  const earlyAssessment =
    Array.isArray(asmRaw.earlyAssessment) && asmRaw.earlyAssessment.length > 0
      ? asmRaw.earlyAssessment
      : [
          'Ajak anak bercerita tentang tema sambil bermain boneka atau media pendukung',
          'Minta anak mengekspresikan ide awal terkait tema secara bebas tanpa tekanan',
          'Observasi bagaimana anak menyapa dan berinteraksi dengan teman baru di awal kegiatan',
          'Catat kemampuan anak dalam mengungkapkan ide dan merespons pertanyaan pemantik',
          'Amati tingkat kepercayaan diri dan antusiasme anak saat berbicara di depan kelompok',
        ]

  const processAssessment =
    Array.isArray(asmRaw.processAssessment) && asmRaw.processAssessment.length > 0
      ? asmRaw.processAssessment
      : [
          'Foto dan video anak saat bermain untuk melihat interaksi sosial dan keterampilan motorik',
          'Buat catatan singkat tentang kata-kata santun dan nilai karakter yang terucap spontan',
          'Dokumentasikan cara anak menyelesaikan tantangan main secara mandiri dan merapikan alat',
          'Rekam suara atau respon anak saat bercerita/bernyanyi untuk menilai kemampuan komunikasi',
          'Amati bagaimana anak bekerja sama dalam kelompok dan menghargai perbedaan karya teman',
        ]

  const finalAssessment =
    Array.isArray(asmRaw.finalAssessment) && asmRaw.finalAssessment.length > 0
      ? asmRaw.finalAssessment
      : [
          'Minta anak mempresentasikan hasil karyanya dengan cara yang menyenangkan dan bangga',
          'Ajak anak merefleksi dengan pertanyaan "Apa pengalaman paling bermakna yang kamu dapatkan?"',
          'Observasi perubahan sikap anak dari awal hingga akhir kegiatan pembelajaran',
          'Dokumentasikan kemampuan anak mengekspresikan perasaan dan pemahaman tentang nilai cinta',
          'Catat perkembangan kemandirian dan rasa syukur anak melalui aktivitas bermain sehari-hari',
        ]

  const iktpChecklist =
    Array.isArray(asmRaw.iktpChecklist) && asmRaw.iktpChecklist.length > 0
      ? asmRaw.iktpChecklist
      : [
          `Anak dapat menyebutkan informasi tentang ${finalTheme} dengan kalimat jelas`,
          'Anak mampu berkreasi menggunakan loose parts secara mandiri tanpa bantuan berlebihan',
          'Anak menunjukkan kepercayaan diri saat memperkenalkan karya kepada teman kelompok',
          'Anak mengucapkan kata santun (terima kasih, tolong, maaf) spontan selama bermain',
          'Anak dapat merapikan alat dan bahan main ke tempat semula setelah selesai',
          'Anak menunjukkan koordinasi motorik halus yang baik dalam kegiatan menggunting/menempel/meronce',
          'Anak mampu bekerja sama dengan teman dalam kelompok dan berbagi peran',
          'Anak menghargai perbedaan dan keunikan hasil karya teman dengan sikap positif',
          'Anak dapat bercerita atau bernyanyi dengan ekspresi gembira dan percaya diri',
          'Anak mampu mempresentasikan hasil karyanya di depan kelas dengan antusias',
          'Anak dapat merefleksi pengalaman belajarnya dengan menjawab pertanyaan pemantik',
          'Anak menunjukkan peningkatan rasa syukur dan kasih sayang kepada sesama ciptaan Tuhan',
        ]

  const anecdotes = Array.isArray(asmRaw.anecdotes)
    ? asmRaw.anecdotes
        .map((anec: any) => ({
          studentName: String(anec.studentName || '').trim(),
          date: String(anec.date || '').trim(),
          event: String(anec.event || '').trim(),
          analysis: String(anec.analysis || '').trim(),
        }))
        .filter((a: any) => a.studentName && a.event)
    : undefined

  const studentChecklists = Array.isArray(asmRaw.studentChecklists)
    ? asmRaw.studentChecklists
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
    : undefined

  return {
    assessmentTechniques,
    indicators:
      indicators.length > 0
        ? indicators
        : [
            { indicator: `Anak mampu mengekspresikan ide kreatif tentang ${finalTheme}` },
            { indicator: 'Anak mampu menggunakan alat dan loose parts dengan aman dan mandiri' },
          ],
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

  return {
    theme: raw.theme || finalTheme,
    subtheme: raw.subtheme || finalSubtheme,
    semester: raw.semester || computedSemester,
    weekNumber: raw.weekNumber || computedWeek,
    groupContext: raw.groupContext || groupName,
    allocation: raw.allocation || '5 Hari x 180 Menit (15 JP)',
    identification: normalizeIdentification(
      raw.identification || {},
      finalTheme,
      finalSubtheme,
      preset
    ),
    learningDesign: normalizeLearningDesign(raw.learningDesign || {}, finalTheme),
    learningExperience: normalizeLearningExperience(raw.learningExperience || {}, finalTheme),
    assessment: normalizeAssessment(raw.assessment || {}, finalTheme),
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

    const normalizedContent = normalizeRpmContent(weeklyLessonPlan.content || {}, {
      finalTheme: weeklyLessonPlan.theme,
      finalSubtheme: weeklyLessonPlan.content?.subtheme || '',
      computedSemester: weeklyLessonPlan.content?.semester || 1,
      computedWeek: weeklyLessonPlan.content?.weekNumber || 1,
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
