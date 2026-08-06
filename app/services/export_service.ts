import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  ImageRun,
} from 'docx'
import type TeachingModule from '#models/teaching_module'
import type Exam from '#models/exam'
import type AnnualPlan from '#models/annual_plan'
import type SemesterPlan from '#models/semester_plan'
import type WeeklyLessonPlan from '#models/weekly_lesson_plan'
import type DailyLessonPlan from '#models/daily_lesson_plan'
import type Lkpd from '#models/lkpd'
import type Assessment from '#models/assessment'
import type PaudAssessment from '#models/paud_assessment'
import type { StudentReport, PaudStudentNarrative } from '#services/report_card_service'
import type User from '#models/user'
import { commitUsageReservation, reserveUsage } from '#services/entitlement_service'
import { auditService } from '#services/audit_service'
import { randomUUID } from 'node:crypto'

async function consumeExport(user: User) {
  const reservationKey = `export:docx:${user.id}:${randomUUID()}`
  const reserved = await reserveUsage(user, 'export_docx', reservationKey, 1, { format: 'docx' })
  if (reserved) await commitUsageReservation(reservationKey)
  await auditService.record({
    actorId: user.id,
    action: 'export.docx',
    entityType: 'document',
    metadata: { format: 'docx' },
  })
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  midterm: 'PTS (Penilaian Tengah Semester)',
  final: 'PAS (Penilaian Akhir Semester)',
  daily: 'Ulangan Harian',
  summative: 'Sumatif',
}

function kopParagraphs(user: User, subtitle: string) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: user.schoolName || 'Sekolah', bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: subtitle, size: 22 })],
    }),
    new Paragraph({ text: '' }),
  ]
}

function richTextItems(value: string | string[] | undefined): string[] {
  const items = Array.isArray(value) ? value : value ? [value] : []
  return items
    .map((item) =>
      item
        .replace(/<br\s*\/?>(\s*)/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim()
    )
    .filter(Boolean)
}

function sectionParagraphs(title: string, value: string | string[] | undefined) {
  const items = richTextItems(value)
  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: title, bold: true })],
    }),
  ]

  if (items.length === 0) {
    paragraphs.push(new Paragraph({ text: '-' }))
  } else {
    for (const item of items) {
      paragraphs.push(new Paragraph({ text: item, bullet: { level: 0 } }))
    }
  }

  paragraphs.push(new Paragraph({ text: '' }))
  return paragraphs
}

async function toBuffer(doc: Document) {
  return Packer.toBuffer(doc)
}

function contentValue(value: unknown): string | string[] {
  if (Array.isArray(value)) return value.map((item) => String(item))
  if (value === null || value === undefined) return ''
  return typeof value === 'string' ? value : String(value)
}

function documentFromChildren(children: Paragraph[]) {
  return toBuffer(new Document({ sections: [{ children }] }))
}

function metaParagraphs(meta: Array<[string, unknown]>) {
  return meta
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([label, value]) => new Paragraph({ text: `${label}: ${String(value)}` }))
}

function examHeaderParagraphs(exam: Exam, user: User) {
  const header = exam.header ?? {}
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: header.institutionName || user.schoolName || 'Sekolah',
          bold: true,
          size: 30,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: header.institutionAddress || '', size: 18 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: header.examLabel || EXAM_TYPE_LABELS[exam.type] || exam.type,
          bold: true,
          size: 24,
        }),
      ],
    }),
    ...metaParagraphs([
      ['Tahun ajaran', header.academicYear],
      ['Semester', header.semester],
      ['Kelompok/Kelas', header.groupName],
      ['Tema/Mata pelajaran', header.subject],
      ['Nama anak', header.studentName],
      ['Tanggal', header.date],
    ]),
    new Paragraph({ text: '' }),
  ]
}

function examQuestionType(q: Record<string, any>) {
  if (q.type === 'multiple_choice' || Array.isArray(q.options)) return 'Pilihan Ganda'
  if (q.type === 'essay') return 'Uraian'
  if (q.type === 'practical') return 'Praktik / Performa'
  if (q.type === 'oral') return 'Lisan'
  return 'Aktivitas Visual'
}

function examQuestionParagraphs(q: Record<string, any>, number: number) {
  const children = [
    new Paragraph({
      children: [
        new TextRun({ text: `${number}. ${q.question || 'Pertanyaan belum diisi.'}`, bold: true }),
      ],
    }),
    new Paragraph({ text: `Bentuk: ${examQuestionType(q)}` }),
  ]
  if (q.instruction) children.push(new Paragraph({ text: `Petunjuk: ${q.instruction}` }))
  if (Array.isArray(q.options)) {
    for (const [index, option] of q.options.entries()) {
      const label =
        typeof option === 'string'
          ? String.fromCharCode(65 + index)
          : option.label || String.fromCharCode(65 + index)
      const text = typeof option === 'string' ? option : option.text || ''
      children.push(new Paragraph({ text: `${label}. ${text}` }))
    }
  } else if (['essay', 'visual', 'practical', 'oral'].includes(q.type)) {
    for (let line = 0; line < 4; line++)
      children.push(
        new Paragraph({ text: '____________________________________________________________' })
      )
  }
  if (q.imageUrl?.startsWith('data:image/')) {
    const encoded = q.imageUrl.split(',')[1]
    if (encoded) {
      try {
        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: Buffer.from(encoded, 'base64'),
                type: 'png',
                transformation: { width: 360, height: 220 },
              }),
            ],
          })
        )
      } catch {}
    }
  }
  if (q.rubric || q.scoringGuide)
    children.push(new Paragraph({ text: `Rubrik: ${q.rubric || q.scoringGuide}` }))
  children.push(new Paragraph({ text: '' }))
  return children
}

export async function exportTeachingModule(teachingModule: TeachingModule, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensiDasar', title: 'Kompetensi Dasar' },
    { key: 'tujuanPembelajaran', title: 'Tujuan Pembelajaran' },
    { key: 'kegiatan', title: 'Kegiatan Pembelajaran' },
    { key: 'penilaian', title: 'Penilaian' },
    { key: 'sumberBelajar', title: 'Sumber Belajar' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Modul Ajar'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: teachingModule.title, bold: true })],
          }),
          new Paragraph({ text: `Mata Pelajaran: ${teachingModule.subject}` }),
          new Paragraph({ text: `Fase: ${teachingModule.phase}` }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) => sectionParagraphs(s.title, teachingModule.content[s.key])),
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportExam(exam: Exam, user: User) {
  await consumeExport(user)
  const questionParagraphs = exam.questions.flatMap((q, i) => examQuestionParagraphs(q, i + 1))

  const answerKeyParagraphs = exam.questions.map(
    (q, i) =>
      new Paragraph({ text: `${i + 1}. ${q.answer}${q.explanation ? ` — ${q.explanation}` : ''}` })
  )

  const doc = new Document({
    sections: [
      {
        children: [
          ...examHeaderParagraphs(exam, user),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: exam.title, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...questionParagraphs,
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: 'Kunci Jawaban', bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...answerKeyParagraphs,
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportAnnualPlan(annualPlan: AnnualPlan, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'kompetensi', title: 'Kompetensi' },
    { key: 'alokasiWaktu', title: 'Alokasi Waktu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'minggu', title: 'Pembagian Minggu' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Program Tahunan'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: annualPlan.subject, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) => sectionParagraphs(s.title, annualPlan.content[s.key] ?? [])),
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportSemesterPlan(semesterPlan: SemesterPlan, user: User) {
  await consumeExport(user)
  const sections: { key: string; title: string }[] = [
    { key: 'minggu', title: 'Pembagian Minggu' },
    { key: 'kegiatan', title: 'Kegiatan' },
    { key: 'target', title: 'Target Pembelajaran' },
    { key: 'materi', title: 'Materi Pembelajaran' },
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          ...kopParagraphs(user, 'Program Semester'),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: semesterPlan.subject, bold: true })],
          }),
          new Paragraph({ text: '' }),
          ...sections.flatMap((s) => sectionParagraphs(s.title, semesterPlan.content[s.key] ?? [])),
        ],
      },
    ],
  })

  return toBuffer(doc)
}

export async function exportCurriculum(
  cps: Array<Record<string, any>>,
  sequences: Array<Record<string, any>>,
  user: User
) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Kurikulum CP, TP, ATP, dan IKTP'),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Capaian Pembelajaran (CP)', bold: true })],
    }),
  ]

  for (const cp of cps) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: `${cp.code ?? ''} ${cp.title ?? ''}`.trim(), bold: true })],
      }),
      new Paragraph({
        text: `${cp.element ?? ''} • ${cp.phase ?? ''} • ${cp.curriculumVersion ?? ''}`,
      }),
      new Paragraph({ text: cp.description || '-' })
    )
    const objectives = Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []
    for (const objective of objectives) {
      children.push(
        new Paragraph({
          text: `TP ${objective.code ?? ''}: ${objective.title ?? '-'}`,
          bullet: { level: 0 },
        })
      )
      for (const indicator of objective.indicators ?? []) {
        children.push(
          new Paragraph({
            text: `IKTP: ${indicator.description ?? '-'}`,
            bullet: { level: 1 },
          })
        )
      }
    }
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Alur Tujuan Pembelajaran (ATP)', bold: true })],
    })
  )
  for (const sequence of sequences) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: sequence.title || 'ATP', bold: true })],
      }),
      ...metaParagraphs([
        ['Profil', sequence.educationLevel],
        ['Kelompok', sequence.groupContext],
        ['Versi kurikulum', sequence.curriculumVersion],
        ['Status', sequence.status],
      ])
    )
    for (const [index, item] of (sequence.items ?? []).entries()) {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${item.title ?? item.learningObjectiveId ?? '-'}`,
          bullet: { level: 0 },
        })
      )
    }
  }
  return documentFromChildren(children)
}

export async function exportWeeklyLessonPlan(weekly: WeeklyLessonPlan, user: User) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Rencana Pelaksanaan Pembelajaran Mingguan (RPPM)'),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: weekly.theme }),
    ...metaParagraphs([
      ['Kelompok', weekly.schoolClass?.name],
      ['Mulai minggu', weekly.weekStartDate?.toFormat('dd/MM/yyyy')],
      ['Status', weekly.status],
    ]),
    new Paragraph({ text: '' }),
  ]
  for (const [key, value] of Object.entries(weekly.content ?? {})) {
    if (key === 'curriculum') continue
    children.push(...sectionParagraphs(key, contentValue(value)))
  }
  return documentFromChildren(children)
}

export async function exportDailyLessonPlan(daily: DailyLessonPlan, user: User) {
  await consumeExport(user)
  const title = String(daily.content?.tema || 'RPPH')
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Rencana Pelaksanaan Pembelajaran Harian (RPPH)'),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: title }),
    ...metaParagraphs([
      ['Kelompok', daily.schoolClass?.name],
      ['Tanggal', daily.date?.toFormat('dd/MM/yyyy')],
      ['Status', daily.status],
    ]),
    new Paragraph({ text: '' }),
  ]
  for (const [key, value] of Object.entries(daily.content ?? {})) {
    if (key === 'tema' || key === 'curriculum') continue
    children.push(...sectionParagraphs(key, contentValue(value)))
  }
  return documentFromChildren(children)
}

export async function exportLkpd(lkpd: Lkpd, user: User) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Lembar Kerja Peserta Didik (LKPD)'),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: lkpd.title }),
    ...metaParagraphs([
      ['Kelompok', lkpd.schoolClass?.name],
      ['Usia', lkpd.ageGroup],
      ['Institusi', lkpd.institutionType],
      ['Tema', lkpd.theme],
      ['Subtema', lkpd.subtheme],
    ]),
    new Paragraph({ text: '' }),
  ]
  for (const [key, value] of Object.entries(lkpd.content ?? {})) {
    children.push(...sectionParagraphs(key, contentValue(value)))
  }
  return documentFromChildren(children)
}

export async function exportAssessment(assessment: Assessment, user: User) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Rekap Penilaian'),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: assessment.title }),
    ...metaParagraphs([
      ['Mata pelajaran', assessment.subject],
      ['Kelas', assessment.schoolClass?.name],
      ['Tanggal', assessment.date?.toFormat('dd/MM/yyyy')],
      ['Jenis', assessment.type],
      ['Tujuan pembelajaran', assessment.learningObjective],
    ]),
    new Paragraph({ text: '' }),
    new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Daftar Nilai' }),
  ]
  for (const [index, score] of (assessment.scores ?? []).entries()) {
    children.push(
      new Paragraph({
        text: `${index + 1}. ${score.student.fullName} (${score.student.nis}) — Nilai: ${score.value ?? '-'}${score.note ? ` — ${score.note}` : ''}`,
      })
    )
  }
  return documentFromChildren(children)
}

export async function exportPaudAssessment(assessment: PaudAssessment, user: User) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, 'Catatan Asesmen PAUD'),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      text: assessment.student?.fullName || 'Asesmen PAUD',
    }),
    ...metaParagraphs([
      ['Kelompok', assessment.schoolClass?.name],
      ['Tanggal', assessment.date?.toFormat('dd/MM/yyyy')],
      ['Jenis asesmen', assessment.type],
      ['Status ketercapaian', assessment.achievementStatus],
      ['Kegiatan', assessment.activity],
    ]),
    ...sectionParagraphs('Catatan Guru', assessment.teacherNote || ''),
  ]
  for (const [key, value] of Object.entries(assessment.content ?? {})) {
    children.push(...sectionParagraphs(key, contentValue(value)))
  }
  if (assessment.attachments?.length) {
    children.push(
      ...sectionParagraphs(
        'Evidence',
        assessment.attachments.map((file) => file.originalName)
      )
    )
  }
  return documentFromChildren(children)
}

export async function exportStudentReport(
  report: StudentReport,
  user: User,
  ctx: { className: string; semesterLabel: string; totalStudents: number }
) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, `Rapor — ${ctx.semesterLabel}`),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: report.fullName }),
    ...metaParagraphs([
      ['NIS', report.nis],
      ['Kelas', ctx.className],
    ]),
    new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Nilai per Mata Pelajaran' }),
    ...report.subjects.map(
      (subject) =>
        new Paragraph({
          text: `${subject.subject}: ${subject.average?.toFixed(1) ?? '-'}`,
          bullet: { level: 0 },
        })
    ),
    new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Ringkasan' }),
    new Paragraph({ text: `Rata-rata keseluruhan: ${report.overallAverage?.toFixed(1) ?? '-'}` }),
    new Paragraph({ text: `Peringkat: ${report.rank ?? '-'} dari ${ctx.totalStudents} siswa` }),
  ]
  return documentFromChildren(children)
}

export async function exportNarrativeReport(
  narrative: PaudStudentNarrative,
  user: User,
  ctx: { className: string; semesterLabel: string }
) {
  await consumeExport(user)
  const children: Paragraph[] = [
    ...kopParagraphs(user, `Rapor Perkembangan — ${ctx.semesterLabel}`),
    new Paragraph({ heading: HeadingLevel.HEADING_1, text: narrative.fullName }),
    ...metaParagraphs([
      ['NIS', narrative.nis],
      ['Kelompok', ctx.className],
    ]),
    new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Catatan Perkembangan' }),
    ...narrative.entries.flatMap((entry) => [
      new Paragraph({
        text: `${entry.typeLabel} — ${entry.date}`,
        heading: HeadingLevel.HEADING_3,
      }),
      new Paragraph({ text: formatNarrativeEntry(entry) }),
    ]),
    new Paragraph({ heading: HeadingLevel.HEADING_2, text: 'Narasi Perkembangan' }),
    ...narrative.narratives.flatMap((item) => [
      new Paragraph({ text: item.element, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: item.content.trim() || 'Belum ada narasi yang disetujui.' }),
    ]),
  ]
  return documentFromChildren(children)
}

function formatNarrativeEntry(entry: PaudStudentNarrative['entries'][number]) {
  return Object.entries(entry.content)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
    .join(' — ')
}
