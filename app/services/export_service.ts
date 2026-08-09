import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  ImageRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  PageOrientation,
  VerticalAlign,
  BorderStyle,
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
  let items: string[] = []
  if (Array.isArray(value)) {
    items = value
  } else if (value) {
    items = [value]
  }
  return items
    .map((item) =>
      item
        .replaceAll('<br>', '\n')
        .replaceAll('<br/>', '\n')
        .replaceAll('<br />', '\n')
        .split('<')
        .map((part) => part.substring(part.indexOf('>') + 1))
        .join('')
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
  if (Array.isArray(value)) {
    return value.map(stringifyValue)
  }
  return stringifyValue(value)
}

function documentFromChildren(children: (Paragraph | Table)[]) {
  return toBuffer(new Document({ sections: [{ children }] }))
}

function stringifyValue(val: unknown): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'object') return JSON.stringify(val)
  if (typeof val === 'string') return val
  if (
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'bigint' ||
    typeof val === 'symbol'
  ) {
    return val.toString()
  }
  return ''
}

function metaParagraphs(meta: Array<[string, unknown]>) {
  return meta
    .filter(([, value]) => stringifyValue(value).trim() !== '')
    .map(([label, value]) => new Paragraph({ text: `${label}: ${stringifyValue(value)}` }))
}

function examHeaderParagraphs(exam: Exam, user: User) {
  const header = exam.header ?? {}
  const paragraphs = [
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
  if (typeof header.logoUrl === 'string' && header.logoUrl.startsWith('data:image/')) {
    const [meta, encoded] = header.logoUrl.split(',')
    const mimeMatch = /^data:(image\/(?:png|jpeg));base64$/.exec(meta)
    const mime = mimeMatch?.[1]
    if (encoded && mime) {
      paragraphs.unshift(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: Buffer.from(encoded, 'base64'),
              type: mime === 'image/jpeg' ? 'jpg' : 'png',
              transformation: { width: 72, height: 72 },
            }),
          ],
        })
      )
    }
  }
  return paragraphs
}

function examQuestionType(q: Record<string, any>) {
  if (
    q.type === 'matching' ||
    String(q.visualType || '')
      .toLowerCase()
      .includes('hubung')
  )
    return 'Hubungkan Garis'
  if (q.type === 'multiple_choice' || (Array.isArray(q.options) && q.options.length > 0))
    return 'Pilihan Ganda'
  if (q.type === 'essay') return 'Uraian'
  if (q.type === 'practical') return 'Praktik / Performa'
  if (q.type === 'oral') return 'Lisan'
  return 'Aktivitas Visual'
}

function renderMultipleChoiceQuestion(options: any[], children: (Paragraph | Table)[]) {
  for (const [index, option] of options.entries()) {
    const defaultLabel = String.fromCodePoint(65 + index)
    const label = typeof option === 'string' ? defaultLabel : option.label || defaultLabel
    const text = typeof option === 'string' ? option : option.text || ''
    children.push(new Paragraph({ text: `${label}. ${text}` }))
  }
}

function renderMatchingQuestion(q: Record<string, any>, children: (Paragraph | Table)[]) {
  const leftItems = Array.isArray(q.leftItems) ? q.leftItems : []
  const rightItems = Array.isArray(q.rightItems) ? q.rightItems : []
  const rowCount = Math.max(leftItems.length, rightItems.length, 2)
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: Array.from({ length: rowCount }, (_, index) => {
      const left = leftItems[index]
      const right = rightItems[index]
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: `●  ${left?.label || 'Item kiri'}` })],
          }),
          new TableCell({
            children: [new Paragraph({ text: `${right?.label || 'Item kanan'}  ●` })],
          }),
        ],
      })
    }),
  })
  children.push(table, new Paragraph({ text: 'Hubungkan pasangan yang sesuai dengan garis.' }))
}

function renderQuestionImage(imageUrl: unknown, children: (Paragraph | Table)[]) {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith('data:image/')) return
  const [meta, encoded] = imageUrl.split(',')
  const mimeMatch = /^data:(image\/(?:png|jpeg));base64$/.exec(meta)
  const mime = mimeMatch?.[1]
  if (encoded && mime) {
    try {
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: Buffer.from(encoded, 'base64'),
              type: mime === 'image/jpeg' ? 'jpg' : 'png',
              transformation: { width: 360, height: 220 },
            }),
          ],
        })
      )
    } catch {
      // ignore image error
    }
  }
}

function examQuestionParagraphs(q: Record<string, any>, number: number) {
  const isMatching =
    q.type === 'matching' ||
    String(q.visualType || '')
      .toLowerCase()
      .includes('hubung')
  const children: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({ text: `${number}. ${q.question || 'Pertanyaan belum diisi.'}`, bold: true }),
      ],
    }),
    new Paragraph({ text: `Bentuk: ${examQuestionType(q)}` }),
  ]
  if (q.instruction) children.push(new Paragraph({ text: `Petunjuk: ${q.instruction}` }))

  if (!isMatching && Array.isArray(q.options) && q.options.length > 0) {
    renderMultipleChoiceQuestion(q.options, children)
  } else if (isMatching) {
    renderMatchingQuestion(q, children)
  } else if (['essay', 'visual', 'practical', 'oral'].includes(q.type)) {
    for (let line = 0; line < 4; line++) {
      children.push(
        new Paragraph({ text: '____________________________________________________________' })
      )
    }
  }

  renderQuestionImage(q.imageUrl, children)

  if (q.rubric || q.scoringGuide) {
    children.push(new Paragraph({ text: `Rubrik: ${q.rubric || q.scoringGuide}` }))
  }
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

  const answerKeyParagraphs = exam.questions.map((q, i) => {
    const expText = q.explanation ? ' — ' + q.explanation : ''
    return new Paragraph({ text: `${i + 1}. ${q.answer}${expText}` })
  })

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

function formatLabel(str: string | null | undefined): string {
  if (!str) return ''
  return str.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function buildDocxCpTable(cp: Record<string, any>): Table | null {
  const objectives = Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []
  if (objectives.length === 0) return null

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { fill: '059669' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Kode TP', bold: true, color: 'FFFFFF' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          shading: { fill: '059669' },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Tujuan Pembelajaran (TP)', bold: true, color: 'FFFFFF' }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 37, type: WidthType.PERCENTAGE },
          shading: { fill: '059669' },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Indikator Ketercapaian (IKTP)', bold: true, color: 'FFFFFF' }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]

  for (const obj of objectives) {
    const indicators = Array.isArray(obj.indicators) ? obj.indicators : []
    const cleanTitle = (obj.title || '')
      .split('<')
      .map((part: string) => part.substring(part.indexOf('>') + 1))
      .join('')

    const iktpParagraphs =
      indicators.length > 0
        ? indicators.map(
            (ind: any) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `• ${ind.description || '-'} `, size: 18 }),
                  new TextRun({
                    text: `[${formatLabel(ind.evidenceType)}]`,
                    bold: true,
                    size: 16,
                    color: '047857',
                  }),
                ],
              })
          )
        : [
            new Paragraph({
              children: [new TextRun({ text: '-', italics: true, color: '6B7280' })],
            }),
          ]

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: obj.code || '-', bold: true, color: '065F46' })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: cleanTitle })],
          }),
          new TableCell({
            width: { size: 37, type: WidthType.PERCENTAGE },
            children: iktpParagraphs,
          }),
        ],
      })
    )
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  })
}

function buildDocxSequenceTable(seq: Record<string, any>): Table | null {
  const items = Array.isArray(seq.items) ? seq.items : []
  if (items.length === 0) return null

  const seqRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          shading: { fill: '047857' },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Urutan', bold: true, color: 'FFFFFF' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: '047857' },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Kode TP', bold: true, color: 'FFFFFF' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 68, type: WidthType.PERCENTAGE },
          shading: { fill: '047857' },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Tujuan Pembelajaran (TP)', bold: true, color: 'FFFFFF' }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]

  for (const [idx, item] of items.entries()) {
    const cleanTitle =
      (item.title || '')
        .split('<')
        .map((part: string) => part.substring(part.indexOf('>') + 1))
        .join('') || `Tujuan Pembelajaran #${item.learningObjectiveId}`
    seqRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${idx + 1}`, bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.code || `TP-${item.learningObjectiveId}`,
                    bold: true,
                    color: '047857',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 68, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ text: cleanTitle })],
          }),
        ],
      })
    )
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: seqRows,
  })
}

function buildDocxPaudHorizontalGridTable(cp: Record<string, any>): Table | null {
  const objectives = Array.isArray(cp.learningObjectives) ? cp.learningObjectives : []
  if (objectives.length === 0) return null

  const obj4 = objectives.slice(0, 4)

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        rowSpan: 2,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 14, type: WidthType.PERCENTAGE },
        shading: { fill: '047857' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Elemen', bold: true, color: 'FFFFFF' })],
          }),
        ],
      }),
      new TableCell({
        rowSpan: 2,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: '047857' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Sub-Elemen CP', bold: true, color: 'FFFFFF' })],
          }),
        ],
      }),
      ...Array.from(
        { length: 4 },
        (_, i) =>
          new TableCell({
            width: { size: 16.5, type: WidthType.PERCENTAGE },
            shading: { fill: '047857' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `TP ${i + 1}`, bold: true, color: 'FFFFFF' })],
              }),
            ],
          })
      ),
    ],
  })

  const subHeaderRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 4,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 66, type: WidthType.PERCENTAGE },
        shading: { fill: 'F9FAFB' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Usia 4 – 6 Tahun (Kelompok A & Kelompok B)',
                bold: true,
                color: '374151',
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const objTitleCells: TableCell[] = [
    new TableCell({
      width: { size: 14, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          children: [new TextRun({ text: cp.element || 'Elemen CP', bold: true, color: '065F46' })],
        }),
      ],
    }),
    new TableCell({
      width: { size: 20, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: cp.title || cp.element || '-', bold: true, color: '111827' }),
          ],
        }),
      ],
    }),
  ]

  for (let i = 0; i < 4; i++) {
    const obj = obj4[i]
    const titleText = obj
      ? (obj.title || '')
          .split('<')
          .map((part: string) => part.substring(part.indexOf('>') + 1))
          .join('')
      : '-'
    objTitleCells.push(
      new TableCell({
        width: { size: 16.5, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ text: titleText })],
      })
    )
  }

  const objRow = new TableRow({ children: objTitleCells })

  const kktpSubHeaderRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 6,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        shading: { fill: 'F3F4F6' },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP) & BUKTI ASESMEN',
                bold: true,
                color: '374151',
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const iktpCells: TableCell[] = [
    new TableCell({
      columnSpan: 2,
      width: { size: 34, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'Indikator IKTP', bold: true, color: '4B5563' })],
        }),
      ],
    }),
  ]

  for (let i = 0; i < 4; i++) {
    const obj = obj4[i]
    const indicators = obj && Array.isArray(obj.indicators) ? obj.indicators : []
    const iktpParagraphs =
      indicators.length > 0
        ? indicators.map(
            (ind: any, idx: number) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `${idx + 1}. ${ind.description || '-'} `, size: 16 }),
                  new TextRun({
                    text: `[${formatLabel(ind.evidenceType)}]`,
                    bold: true,
                    size: 15,
                    color: '047857',
                  }),
                ],
              })
          )
        : [
            new Paragraph({
              children: [new TextRun({ text: '-', italics: true, color: '6B7280' })],
            }),
          ]

    iktpCells.push(
      new TableCell({
        width: { size: 16.5, type: WidthType.PERCENTAGE },
        children: iktpParagraphs,
      })
    )
  }

  const iktpRow = new TableRow({ children: iktpCells })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, subHeaderRow, objRow, kktpSubHeaderRow, iktpRow],
  })
}

export async function exportCurriculum(
  cps: Array<Record<string, any>>,
  sequences: Array<Record<string, any>>,
  user: User
) {
  await consumeExport(user)

  const children: (Paragraph | Table)[] = [
    ...kopParagraphs(user, 'DOKUMEN CAPAIAN, TUJUAN & ALUR PEMBELAJARAN (CP, TP & ATP)'),
    new Paragraph({ text: '' }),
  ]

  const isPaud =
    user.educationLevel === 'tk' ||
    (user as any).institutionType === 'ra' ||
    (user as any).institutionType === 'paud'

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Satuan Pendidikan', bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  text: (user as any).institutionName || user.schoolName || 'TK / Sekolah',
                }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Tanggal Cetak', bold: true })] }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  text: new Date().toLocaleDateString('id-ID', { dateStyle: 'long' }),
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Jenjang / Fase', bold: true })] }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: isPaud ? 'PAUD / TK (Fase Fondasi)' : 'Sekolah Dasar (SD)' }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Versi Kurikulum', bold: true })] }),
              ],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: user.curriculumVersion || 'Kurikulum Merdeka' })],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: isPaud
            ? 'I. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) - RA / TK FASE FONDASI'
            : 'I. MATRIKS CAPAIAN PEMBELAJARAN (CP) & TUJUAN PEMBELAJARAN (TP)',
          bold: true,
          color: '047857',
        }),
      ],
    }),
    new Paragraph({ text: '' })
  )

  for (const cp of cps) {
    const cleanCpDesc = (cp.description || '-')
      .split('<')
      .map((part: string) => part.substring(part.indexOf('>') + 1))
      .join('')
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `Elemen: ${cp.element || '-'} (${cp.code || 'CP'})`,
            bold: true,
            color: '065F46',
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Capaian Pembelajaran: ', bold: true }),
          new TextRun({ text: cleanCpDesc }),
        ],
      }),
      new Paragraph({ text: '' })
    )

    const table = isPaud ? buildDocxPaudHorizontalGridTable(cp) : buildDocxCpTable(cp)
    if (table) {
      children.push(table, new Paragraph({ text: '' }))
    }
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: 'II. ALUR TUJUAN PEMBELAJARAN (ATP) TERSIMPAN',
          bold: true,
          color: '047857',
        }),
      ],
    }),
    new Paragraph({ text: '' })
  )

  const borderlessTableBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  }

  for (const seq of sequences) {
    const items = Array.isArray(seq.items) ? seq.items : []
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `${seq.title || 'Alur ATP'} (${items.length} Langkah TP)`,
            bold: true,
          }),
        ],
      }),
      new Paragraph({ text: '' })
    )

    const seqTable = buildDocxSequenceTable(seq)
    if (seqTable) {
      children.push(seqTable, new Paragraph({ text: '' }))
    }
  }

  children.push(
    new Paragraph({ text: '' }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: borderlessTableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderlessTableBorders,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', bold: true })] }),
                new Paragraph({ text: 'Kepala Sekolah' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({
                  children: [new TextRun({ text: '________________________', bold: true })],
                }),
                new Paragraph({ text: 'NIP. ........................................' }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderlessTableBorders,
              children: [
                new Paragraph({ text: 'Penyusun / Guru Kelas,' }),
                new Paragraph({ text: user.fullName || 'Guru Pengampu' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `( ${user.fullName || '........................'} )`,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({ text: 'NIP. ........................................' }),
              ],
            }),
          ],
        }),
      ],
    })
  )

  return toBuffer(
    new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          children,
        },
      ],
    })
  )
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
    const noteText = score.note ? ' — ' + score.note : ''
    children.push(
      new Paragraph({
        text: `${index + 1}. ${score.student.fullName} (${score.student.nis}) — Nilai: ${score.value ?? '-'}${noteText}`,
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
