import type User from '#models/user'
import { expressToolsRepository } from '#repositories/express_tools_repository'
import type { ExpressToolsRepository } from '#repositories/express_tools_repository'
import { AiServiceError, normalizeStringArraySections } from '#services/ai_service'
import { katrolPrompt, jurnalPrompt, kokurikulerPrompt } from '#services/ai_prompts'
import { annualPlanPrompt, semesterPlanPrompt } from '#services/ai_prompts'
import { callAiJsonForUser } from '#services/user_ai_service'
import { creditService, InsufficientCreditsError } from '#services/credit_service'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { resolveEducationProfile } from '#services/education_profile'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'

export type ExpressGenerationResult<T> =
  | { status: 'invalid_input'; message: string }
  | { status: 'insufficient_credits'; message: string }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }

export class ExpressToolsService {
  constructor(private readonly repository: ExpressToolsRepository = expressToolsRepository) {}

  async getModulAjarData(user: User) {
    const isTk = user.isTk
    const educationProfile = resolveEducationProfile(
      user.educationLevel,
      user.institutionType,
      user.curriculumVersion
    )
    const data = await this.repository.getModulAjarData(user.id, isTk)
    const recentModules = isTk
      ? data.weeklyLessonPlans.map((plan) => ({
          id: plan.id,
          title: plan.theme || 'Modul Ajar RPPM',
          subject: plan.content?.subject || 'Tematik PAUD KBC',
          phase: 'Fondasi',
          status: plan.status || 'published',
          createdAt: plan.createdAt ? plan.createdAt.toISO() || '' : '',
          schoolClass: plan.schoolClass ? plan.schoolClass.toJSON() : undefined,
        }))
      : data.teachingModules.map((module) => ({
          id: module.id,
          title: module.title || 'Modul Ajar',
          subject: module.subject || '',
          phase: module.phase || '',
          status: module.status || 'published',
          createdAt: module.createdAt ? module.createdAt.toISO() || '' : '',
          schoolClass: module.schoolClass ? module.schoolClass.toJSON() : undefined,
        }))

    return {
      isTk,
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
      educationProfile,
      classes: data.classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: data.subjects.map((subject) => subject.toJSON()),
      recentModules,
    }
  }

  async getLkpdData(user: User) {
    const { classes, recentLkpds } = await this.repository.getLkpdData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      recentLkpds: recentLkpds.map((lkpd) => lkpd.toJSON()),
      educationLevel: user.educationLevel,
      institutionType: user.institutionType || user.educationLevel || null,
      educationProfile: resolveEducationProfile(
        user.educationLevel,
        user.institutionType,
        user.curriculumVersion
      ),
    }
  }

  async getSoalData(user: User) {
    const { classes, subjects, recentExams } = await this.repository.getSoalData(user.id)
    const recentAssessments = recentExams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      subject: exam.header?.subject || '',
      gradeLevel: exam.header?.groupName || 'Belum ditentukan',
      totalQuestions: Array.isArray(exam.questions) ? exam.questions.length : 0,
      createdAt: exam.createdAt ? exam.createdAt.toISO() || '' : '',
    }))
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      recentExams: recentExams.map((exam) => exam.toJSON()),
      recentAssessments,
      isTk: user.isTk,
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
      educationProfile: resolveEducationProfile(
        user.educationLevel,
        user.institutionType,
        user.curriculumVersion
      ),
    }
  }

  async getProtaPromesData(user: User) {
    const { classes, subjects, annualPlans, semesterPlans, academicYears, semesters, cps } =
      await this.repository.getProtaPromesData(user.id)
    return {
      isTk: user.isTk,
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
      userProfile: {
        fullName: user.fullName,
        schoolName: user.schoolName,
        educationLevel: user.educationLevel,
        institutionType: user.institutionType,
        defaultGroupContext: user.defaultGroupContext,
      },
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      subjects: subjects.map((subject) => subject.toJSON()),
      annualPlans: annualPlans.map((plan) => plan.toJSON()),
      semesterPlans: semesterPlans.map((plan) => plan.toJSON()),
      academicYears: academicYears.map((year) => year.toJSON()),
      semesters: semesters.map((semester) => semester.toJSON()),
      cps: cps.map((cp) => cp.toJSON()),
    }
  }

  async generateProtaPromes(
    user: User,
    input: Record<string, any>
  ): Promise<
    | { status: 'invalid_input'; message: string }
    | { status: 'insufficient_credits' }
    | { status: 'generation_error'; message: string }
    | {
        status: 'created'
        annualPlan?: AnnualPlan
        semesterPlan?: SemesterPlan
        planType: 'all' | 'prota' | 'promes'
      }
  > {
    const subject = typeof input.subject === 'string' ? input.subject.trim() : ''
    const planType: 'all' | 'prota' | 'promes' =
      input.planType === 'prota' || input.planType === 'promes' ? input.planType : 'all'
    const creditsNeeded = planType === 'all' ? 2 : 1

    if (!subject) {
      return { status: 'invalid_input', message: 'Mata pelajaran atau tema wajib diisi.' }
    }

    const { academicYear, semester, schoolClass } =
      await this.repository.resolveOrCreateProtaPromesReferences({
        userId: user.id,
        academicYearId: input.academicYearId ? Number(input.academicYearId) : undefined,
        academicYearName: input.academicYearName,
        semesterId: input.semesterId ? Number(input.semesterId) : undefined,
        semesterName: input.semesterName,
        classId: input.classId ? Number(input.classId) : undefined,
        className: input.className,
      })

    if (!(await creditService.hasEnoughGenerationCredits(user, creditsNeeded))) {
      return { status: 'insufficient_credits' }
    }

    try {
      const curriculum = await getCurriculumContext(user.id, input.learningSequenceId)
      const educationLevel = input.educationLevel || user.educationLevel
      const institutionType = user.institutionType
      const curriculumVersion = input.curriculumType || user.curriculumVersion
      const schoolName = input.schoolName?.trim() || user.schoolName || 'Satuan Pendidikan'
      const teacherName = input.teacherName?.trim() || user.fullName || 'Guru Kelas'
      const weeklyJp = input.weeklyJp ? Number(input.weeklyJp) : undefined
      const effectiveWeeks = input.effectiveWeeks ? Number(input.effectiveWeeks) : 18
      const effectiveWeeksSem2 = input.effectiveWeeksSem2 ? Number(input.effectiveWeeksSem2) : 18
      const startMonth = input.startMonth?.trim()
      const cpText = input.cpText?.trim()
      const rawMaterials = input.rawMaterials?.trim()

      let creditDescription = `Prota & Promes: ${subject}`
      if (planType === 'prota') {
        creditDescription = `Prota: ${subject}`
      } else if (planType === 'promes') {
        creditDescription = `Promes: ${subject}`
      }

      const created = await creditService.withGenerationCredit(
        user,
        creditsNeeded,
        creditDescription,
        'express_tools.generate_planning',
        async (reservationKey) => {
          let annualPlan: AnnualPlan | undefined
          let semesterPlan: SemesterPlan | undefined

          if (planType === 'all' || planType === 'prota') {
            const annualPrompt = annualPlanPrompt({
              subject,
              educationLevel,
              institutionType,
              curriculumVersion,
              academicYear: academicYear.name,
              className: schoolClass.name,
              weeklyJp,
              effectiveWeeksSem1: effectiveWeeks,
              effectiveWeeksSem2: effectiveWeeksSem2,
              schoolName,
              teacherName,
              cpText,
              rawMaterials,
            })
            const annualRaw = await callAiJsonForUser<Record<string, unknown>>(
              user,
              {
                operation: 'express_tools.generate_planning',
                systemPrompt: annualPrompt.system,
                userPrompt: annualPrompt.user,
              },
              {
                reservationKey,
                amount: creditsNeeded,
                description: `Prota: ${subject}`,
              }
            )
            const annualContent: Record<string, any> = normalizeStringArraySections(annualRaw, [
              'kompetensi',
              'alokasiWaktu',
              'kegiatan',
              'minggu',
            ])
            annualContent.curriculum = curriculum
            annualContent.metadata = {
              academicYear: academicYear.name,
              schoolName,
              teacherName,
              className: schoolClass.name,
              weeklyJp,
              effectiveWeeksSem1: effectiveWeeks,
              effectiveWeeksSem2: effectiveWeeksSem2,
            }
            annualPlan = await this.repository.createSingleAnnualPlan({
              userId: user.id,
              academicYearId: academicYear.id,
              subject,
              annualContent,
            })
          }

          if (planType === 'all' || planType === 'promes') {
            const semesterPrompt = semesterPlanPrompt({
              subject,
              educationLevel,
              institutionType,
              curriculumVersion,
              academicYear: academicYear.name,
              semesterName: semester.name,
              startMonth,
              className: schoolClass.name,
              weeklyJp,
              effectiveWeeks,
              schoolName,
              teacherName,
              cpText,
              rawMaterials,
            })
            const semesterRaw = await callAiJsonForUser<Record<string, unknown>>(
              user,
              {
                operation: 'express_tools.generate_planning',
                systemPrompt: semesterPrompt.system,
                userPrompt: semesterPrompt.user,
              },
              {
                reservationKey,
                amount: creditsNeeded,
                description: `Promes: ${subject}`,
              }
            )
            const semesterContent: Record<string, any> = normalizeStringArraySections(semesterRaw, [
              'minggu',
              'kegiatan',
              'target',
              'materi',
            ])
            semesterContent.curriculum = curriculum
            semesterContent.metadata = {
              academicYear: academicYear.name,
              semesterName: semester.name,
              schoolName,
              teacherName,
              className: schoolClass.name,
              weeklyJp,
              effectiveWeeks,
              startMonth,
            }
            semesterPlan = await this.repository.createSingleSemesterPlan({
              userId: user.id,
              classId: schoolClass.id,
              semesterId: semester.id,
              subject,
              semesterContent,
            })
          }

          return { annualPlan, semesterPlan, planType }
        }
      )
      return { status: 'created', ...created }
    } catch (error) {
      if (error instanceof InsufficientCreditsError) return { status: 'insufficient_credits' }
      return {
        status: 'generation_error',
        message:
          error instanceof AiServiceError
            ? error.message
            : 'Gagal membuat Prota & Promes. Coba lagi.',
      }
    }
  }

  async getRaporData(user: User) {
    const { classes, recentNarratives, semesters } = await this.repository.getRaporData(user.id)
    return {
      classes: classes.map((schoolClass) => schoolClass.toJSON()),
      recentNarratives: recentNarratives.map((narrative) => narrative.toJSON()),
      semesters: semesters.map((semester) => semester.toJSON()),
      isTk: user.isTk,
      educationLevel: user.educationLevel,
      institutionType: user.institutionType,
    }
  }

  async getClassesData(user: User) {
    const classes = await this.repository.listClasses(user.id)
    return { classes: classes.map((schoolClass) => schoolClass.toJSON()) }
  }

  async generateKatrol(
    user: User,
    input: Record<string, any>
  ): Promise<ExpressGenerationResult<Record<string, any>>> {
    const subject = boundedText(input.subject, 100) || 'Penilaian Siswa'
    const topic = boundedText(input.topic, 160) || 'Ulangan Harian'
    const kktp = toBoundedScore(input.passingGrade ?? input.kktp, 75)
    const targetMin = toBoundedScore(input.targetMin, 75)
    const targetMax = toBoundedScore(input.targetMax, 95)
    const method = normalizeKatrolMethod(input.method)
    const scores = parseKatrolScores(input.scores, boundedText(input.rawInput, 20_000))

    if (scores.length === 0 || targetMin >= targetMax) {
      return {
        status: 'invalid_input',
        message:
          targetMin >= targetMax
            ? 'Target nilai terendah harus lebih kecil dari target nilai tertinggi.'
            : 'Masukkan minimal satu nama dan nilai siswa yang valid (0–100).',
      }
    }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return {
        status: 'insufficient_credits',
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      }
    }

    try {
      const data = await creditService.withGenerationCredit(
        user,
        1,
        `Analisis Katrol Nilai: ${subject} - ${topic}`,
        'express_tools.generate_lesson_summary',
        async (reservationKey) => {
          const results = calculateKatrolResults(scores, method, targetMin, targetMax, kktp)
          const statistics = summarizeKatrol(scores, results)
          // Nama siswa hanya dibutuhkan untuk hasil yang ditampilkan guru;
          // narasi AI menerima angka anonim agar PII tidak masuk ke provider.
          const narrativeScores = results.map(({ originalScore, adjustedScore, status }) => ({
            originalScore,
            adjustedScore,
            status,
          }))
          const prompt = katrolPrompt({
            subject,
            topic: topic || 'Ulangan Harian',
            kktp,
            scores: narrativeScores,
            method,
            targetMin,
            targetMax,
            passingGrade: kktp,
          })
          const narrative = await callAiJsonForUser<Record<string, any>>(
            user,
            {
              operation: 'express_tools.generate_lesson_summary',
              systemPrompt: prompt.system,
              userPrompt: prompt.user,
            },
            {
              reservationKey,
              amount: 1,
              description: `Analisis Katrol Nilai: ${subject} - ${topic}`,
            }
          )
          return {
            statistics,
            results: results.map(({ name, originalScore, adjustedScore, status }) => ({
              name,
              rawScore: originalScore,
              adjustedScore,
              status,
            })),
            supervisionJustification:
              typeof narrative.supervisionJustification === 'string'
                ? narrative.supervisionJustification
                : typeof narrative.remedialAnalysis === 'string'
                  ? narrative.remedialAnalysis
                  : 'Nilai dihitung menggunakan formula yang dipilih dan perlu ditinjau guru sebelum digunakan.',
            remedialActivities: Array.isArray(narrative.remedialActivities)
              ? narrative.remedialActivities
              : [],
            enrichmentActivities: Array.isArray(narrative.enrichmentActivities)
              ? narrative.enrichmentActivities
              : [],
          }
        }
      )
      return { status: 'success', data }
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return {
          status: 'insufficient_credits',
          message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
        }
      }
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal memproses analisis katrol nilai',
      }
    }
  }

  async generateJurnal(
    user: User,
    input: Record<string, any>
  ): Promise<ExpressGenerationResult<Record<string, any>>> {
    const subject = boundedText(input.subject, 100)
    const topic = boundedText(input.topic, 200)
    const date = boundedText(input.date, 30)
    const grade = boundedText(input.grade, 100)
    const schoolClass = boundedText(input.schoolClass, 100)
    const attendanceSummary = boundedText(input.attendanceSummary ?? input.attendanceNotes, 300)
    const lessonNotes = boundedText(input.lessonNotes ?? input.teacherNotes, 1_000)
    if (!subject || !topic) {
      return { status: 'invalid_input', message: 'Mata pelajaran dan topik wajib diisi' }
    }

    if (!(await creditService.hasEnoughGenerationCredits(user, 1))) {
      return {
        status: 'insufficient_credits',
        message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
      }
    }

    try {
      const data = await creditService.withGenerationCredit(
        user,
        1,
        `Jurnal Mengajar & Refleksi: ${subject} - ${topic}`,
        'express_tools.generate_reflection',
        async (reservationKey) => {
          const prompt = jurnalPrompt({
            subject,
            topic,
            date: date || new Date().toISOString().split('T')[0],
            grade: grade || (user.isTk ? 'Kelompok B (5-6 Tahun)' : 'Kelas 1'),
            attendanceSummary:
              typeof attendanceSummary === 'string' ? attendanceSummary : undefined,
            lessonNotes,
            educationLevel: user.educationLevel,
            institutionType: user.institutionType,
            curriculumVersion: user.curriculumVersion,
          })
          const generated = await callAiJsonForUser<Record<string, any>>(
            user,
            {
              operation: 'express_tools.generate_reflection',
              systemPrompt: prompt.system,
              userPrompt: prompt.user,
            },
            {
              reservationKey,
              amount: 1,
              description: `Jurnal Mengajar & Refleksi: ${subject} - ${topic}`,
            }
          )
          return {
            journal: normalizeJournalResult(generated, {
              date: date || new Date().toISOString().split('T')[0],
              schoolClass: typeof schoolClass === 'string' ? schoolClass : undefined,
              subject,
              topic,
              attendanceSummary:
                typeof attendanceSummary === 'string' ? attendanceSummary : undefined,
            }),
          }
        }
      )
      return { status: 'success', data }
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return {
          status: 'insufficient_credits',
          message: 'Saldo kredit Anda habis. Silakan top-up kredit untuk melanjutkan.',
        }
      }
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat jurnal mengajar harian',
      }
    }
  }

  async generateKokurikuler(
    user: User,
    input: Record<string, any>
  ): Promise<ExpressGenerationResult<Record<string, any>>> {
    const theme = boundedText(input.theme, 160)
    const phase = boundedText(input.phase, 30)
    const targetLevel = boundedText(input.targetLevel, 100)
    const targetDuration = boundedText(input.targetDuration, 100)
    const dimensions = Array.isArray(input.dimensions)
      ? input.dimensions
          .map((item: unknown) => boundedText(item, 100))
          .filter(Boolean)
          .slice(0, 12)
      : []
    const topic = boundedText(input.topic, 160) || boundedText(input.projectTitle, 160)
    if (!theme || !topic) {
      return { status: 'invalid_input', message: 'Tema dan topik proyek wajib diisi' }
    }

    if (!(await creditService.hasEnoughGenerationCredits(user, 2))) {
      return {
        status: 'insufficient_credits',
        message: 'Saldo kredit Anda tidak mencukupi (butuh 2 kredit). Silakan top-up kredit.',
      }
    }

    try {
      const data = await creditService.withGenerationCredit(
        user,
        2,
        `Modul Projek P5 / Kokurikuler: ${theme} - ${topic}`,
        'express_tools.generate_rubric',
        async (reservationKey) => {
          const prompt = kokurikulerPrompt({
            theme,
            topic,
            phase: phase || (user.isTk ? 'Fondasi' : 'A'),
            targetLevel: targetLevel || (user.isTk ? 'TK/RA B (5-6 Tahun)' : 'SD Kelas 1'),
            targetDuration,
            dimensions: Array.isArray(dimensions) ? dimensions : undefined,
            institutionType: user.institutionType || undefined,
            educationLevel: user.educationLevel || undefined,
          })
          const generated = await callAiJsonForUser<Record<string, any>>(
            user,
            {
              operation: 'express_tools.generate_rubric',
              systemPrompt: prompt.system,
              userPrompt: prompt.user,
            },
            {
              reservationKey,
              amount: 2,
              description: `Modul Projek P5 / Kokurikuler: ${theme} - ${topic}`,
            }
          )
          return {
            projectModule: normalizeKokurikulerResult(generated, {
              theme,
              topic,
              phase,
              targetDuration,
            }),
          }
        }
      )
      return { status: 'success', data }
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return {
          status: 'insufficient_credits',
          message: 'Saldo kredit Anda tidak mencukupi (butuh 2 kredit). Silakan top-up kredit.',
        }
      }
      return {
        status: 'error',
        message:
          error instanceof AiServiceError ? error.message : 'Gagal membuat modul kokurikuler P5',
      }
    }
  }
}

export const expressToolsService = new ExpressToolsService()

type KatrolMethod = 'linear' | 'sqrt' | 'average' | 'constant'
type KatrolScore = { name: string; originalScore: number }
type KatrolResult = KatrolScore & { adjustedScore: number; status: 'Lulus' | 'Remedial' }

function normalizeKatrolMethod(value: unknown): KatrolMethod {
  return value === 'sqrt' || value === 'average' || value === 'constant' ? value : 'linear'
}

function toBoundedScore(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(100, Math.max(0, parsed))
}

function parseKatrolScores(rawScores: unknown, rawInput: unknown): KatrolScore[] {
  const candidates: unknown[] = Array.isArray(rawScores)
    ? rawScores.slice(0, 200)
    : typeof rawInput === 'string'
      ? rawInput.split(/\r?\n/).slice(0, 200)
      : []

  return candidates
    .map((candidate, index): KatrolScore | null => {
      if (candidate && typeof candidate === 'object') {
        const record = candidate as Record<string, unknown>
        const name = typeof record.name === 'string' ? record.name : `Baris ${index + 1}`
        const originalScore = Number(record.originalScore ?? record.score)
        return normalizeKatrolScore(name, originalScore)
      }

      if (typeof candidate !== 'string') return null
      const value = candidate.trim()
      if (!value) return null
      const match = value.match(/^(.{1,120}?)(?:\s*:\s*|\s*,\s*)(-?\d+(?:[.,]\d+)?)$/)
      if (match) return normalizeKatrolScore(match[1], Number(match[2].replace(',', '.')))

      const score = Number(value.replace(',', '.'))
      return Number.isFinite(score) ? normalizeKatrolScore(`Baris ${index + 1}`, score) : null
    })
    .filter((score): score is KatrolScore => score !== null)
}

function normalizeKatrolScore(name: string, originalScore: number): KatrolScore | null {
  const cleanName = [...name]
    .filter((character) => {
      const code = character.charCodeAt(0)
      return code > 0x1f && code !== 0x7f
    })
    .join('')
    .trim()
    .slice(0, 120)
  if (!cleanName || !Number.isFinite(originalScore) || originalScore < 0 || originalScore > 100) {
    return null
  }
  return { name: cleanName, originalScore: roundScore(originalScore) }
}

function calculateKatrolResults(
  scores: KatrolScore[],
  method: KatrolMethod,
  targetMin: number,
  targetMax: number,
  passingGrade: number
): KatrolResult[] {
  const rawValues = scores.map((score) => score.originalScore)
  const rawMin = Math.min(...rawValues)
  const rawMax = Math.max(...rawValues)
  const rawAverage = rawValues.reduce((sum, value) => sum + value, 0) / rawValues.length
  const targetAverage = (targetMin + targetMax) / 2

  return scores.map((score) => {
    let adjustedScore: number
    if (method === 'linear') {
      adjustedScore =
        rawMax === rawMin
          ? targetMin
          : targetMin +
            ((score.originalScore - rawMin) / (rawMax - rawMin)) * (targetMax - targetMin)
    } else if (method === 'sqrt') {
      adjustedScore = Math.sqrt(score.originalScore / 100) * 100
    } else if (method === 'constant') {
      adjustedScore = score.originalScore + targetMin - rawMin
    } else {
      adjustedScore = score.originalScore + targetAverage - rawAverage
    }

    adjustedScore = roundScore(Math.min(100, Math.max(0, adjustedScore)))
    return {
      ...score,
      adjustedScore,
      status: adjustedScore >= passingGrade ? 'Lulus' : 'Remedial',
    }
  })
}

function summarizeKatrol(scores: KatrolScore[], results: KatrolResult[]) {
  const rawValues = scores.map((score) => score.originalScore)
  const adjustedValues = results.map((result) => result.adjustedScore)
  return {
    rawAverage: roundScore(average(rawValues)),
    adjustedAverage: roundScore(average(adjustedValues)),
    highestRaw: Math.max(...rawValues),
    highestAdjusted: Math.max(...adjustedValues),
    lowestRaw: Math.min(...rawValues),
    lowestAdjusted: Math.min(...adjustedValues),
    passCount: results.filter((result) => result.status === 'Lulus').length,
    totalStudents: results.length,
  }
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function roundScore(value: number) {
  return Math.round(value * 100) / 100
}

function boundedText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function asJournalText(value: unknown, fallback: string) {
  if (Array.isArray(value)) {
    const items = value.filter(
      (item): item is string => typeof item === 'string' && Boolean(item.trim())
    )
    if (items.length) return items.join('\n')
  }
  if (typeof value === 'string' && value.trim()) return value.trim()
  return fallback
}

function normalizeJournalResult(
  generated: Record<string, any>,
  context: {
    date: string
    schoolClass?: string
    subject: string
    topic: string
    attendanceSummary?: string
  }
) {
  const date = asJournalText(generated.tanggal, context.date)
  const subject = asJournalText(generated.mataPelajaran, context.subject)
  const topic = asJournalText(generated.materi, context.topic)
  const activities = asJournalText(
    generated.tujuanTercapai,
    'Tujuan dan rangkaian kegiatan ditinjau berdasarkan topik yang dicatat guru.'
  )
  const challenges = asJournalText(
    generated.kendalaPembelajaran,
    'Belum ada kendala pembelajaran yang dicatat.'
  )
  const studentBehavior = asJournalText(
    generated.catatanKarakterSiswa,
    'Belum ada catatan perilaku siswa yang diberikan.'
  )
  const teacherReflection = asJournalText(
    generated.refleksiGuru,
    'Refleksi guru belum diisi; tinjau kembali kegiatan dan bukti belajar.'
  )
  const followUp = asJournalText(
    generated.tindakLanjut,
    'Tindak lanjut belum diisi; tentukan langkah berikutnya setelah meninjau hasil belajar.'
  )
  const attendance = context.attendanceSummary?.trim() || 'Tidak dicatat'
  const formattedDocumentText = [
    'JURNAL MENGAJAR & REFLEKSI GURU',
    `Tanggal: ${date}`,
    `Kelas: ${context.schoolClass || 'Belum dipilih'}`,
    `Mata Pelajaran / Tema: ${subject}`,
    `Topik: ${topic}`,
    `Kehadiran: ${attendance}`,
    '',
    'TUJUAN DAN KEGIATAN',
    activities,
    '',
    'KENDALA PEMBELAJARAN',
    challenges,
    '',
    'CATATAN PERKEMBANGAN SISWA',
    studentBehavior,
    '',
    'REFLEKSI GURU',
    teacherReflection,
    '',
    'TINDAK LANJUT',
    followUp,
  ].join('\n')

  return {
    title: `Jurnal Mengajar - ${topic}`,
    date,
    schoolClass: context.schoolClass || 'Belum dipilih',
    subject,
    topic,
    coreActivities: activities,
    studentBehaviorNotes: studentBehavior,
    teacherReflection,
    followUpAction: followUp,
    formattedDocumentText,
  }
}

function normalizeKokurikulerResult(
  generated: Record<string, any>,
  context: { theme: string; topic: string; phase?: string; targetDuration?: string }
) {
  const text = (value: unknown, fallback: string) =>
    typeof value === 'string' && value.trim() ? value.trim() : fallback
  const stageValues = Array.isArray(generated.tahapanProjek) ? generated.tahapanProjek : []
  const stages = {
    introduction: 'Tahap pengenalan belum diisi.',
    contextualization: 'Tahap kontekstualisasi belum diisi.',
    action: 'Tahap aksi belum diisi.',
    reflection: 'Tahap refleksi belum diisi.',
    followUp: 'Tahap tindak lanjut belum diisi.',
  }
  const stageKeyByLabel: Record<string, keyof typeof stages> = {
    'pengenalan': 'introduction',
    'kontekstualisasi': 'contextualization',
    'aksi': 'action',
    'refleksi': 'reflection',
    'tindak lanjut': 'followUp',
  }
  for (const stage of stageValues) {
    if (!stage || typeof stage !== 'object') continue
    const record = stage as Record<string, unknown>
    const label = text(record.tahap, '').toLowerCase()
    const key = Object.keys(stageKeyByLabel).find((candidate) => label.includes(candidate))
    if (!key) continue
    stages[stageKeyByLabel[key]] = text(
      record.deskripsi,
      text(record.namaAktivitas, stages[stageKeyByLabel[key]])
    )
  }

  const dimensionValues = Array.isArray(generated.dimensiElemen) ? generated.dimensiElemen : []
  const dimensions = dimensionValues
    .map((value: unknown) => {
      if (typeof value === 'string') return value.trim()
      if (!value || typeof value !== 'object') return ''
      const record = value as Record<string, unknown>
      return [record.dimensi, record.elemen, record.targetCapaian]
        .filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
        .join(' — ')
    })
    .filter(Boolean)
  const summary = text(
    generated.projectSummary,
    `Projek ${context.topic} bertema ${context.theme} untuk mengembangkan pengalaman belajar yang kontekstual.`
  )
  const rubric = text(
    generated.assessmentRubric,
    Array.isArray(generated.asesmen?.rubrik)
      ? generated.asesmen.rubrik.filter((item: unknown) => typeof item === 'string').join('\n')
      : 'Rubrik asesmen belum diisi; tinjau bukti proses dan hasil projek.'
  )
  const title = text(generated.judulProjek, context.topic)
  const theme = text(generated.tema, context.theme)
  const phase = text(generated.fase, context.phase || 'Sesuai profil')
  const targetDuration = text(
    generated.alokasiWaktu,
    context.targetDuration || 'Sesuai kalender satuan pendidikan'
  )
  const formattedDocumentText = [
    `MODUL PROJEK KOKURIKULER: ${title}`,
    `Tema: ${theme}`,
    `Fase: ${phase}`,
    `Alokasi waktu: ${targetDuration}`,
    '',
    'RINGKASAN PROJEK',
    summary,
    '',
    'DIMENSI DAN TARGET CAPAIAN',
    dimensions.length ? dimensions.join('\n') : 'Belum ada dimensi yang dirumuskan.',
    '',
    'TAHAPAN PROJEK',
    `Pengenalan: ${stages.introduction}`,
    `Kontekstualisasi: ${stages.contextualization}`,
    `Aksi: ${stages.action}`,
    `Refleksi: ${stages.reflection}`,
    `Tindak Lanjut: ${stages.followUp}`,
    '',
    'RUBRIK ASESMEN',
    rubric,
  ].join('\n')

  return {
    title,
    theme,
    phase,
    targetDuration,
    dimensions,
    projectSummary: summary,
    stages,
    assessmentRubric: rubric,
    formattedDocumentText,
  }
}
