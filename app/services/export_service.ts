import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  PageOrientation,
  TableLayoutType,
  VerticalAlign,
  BorderStyle,
  UnderlineType,
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

export const EXAM_TYPE_LABELS: Record<string, string> = {
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
  const kop = user.kopSurat ?? {}

  const logoUrl = header.logoUrl || kop.logoUrl
  const institutionName = (
    header.institutionName ||
    kop.institutionName ||
    user.schoolName ||
    'SEKOLAH / TK'
  ).toUpperCase()
  const institutionSubName = (
    header.institutionSubName ||
    kop.institutionSubName ||
    ''
  ).toUpperCase()
  const addressLine1 =
    header.addressLine1 || header.institutionAddress || kop.addressLine1 || 'Jl. Pendidikan No. 123'
  const addressLine2 = header.addressLine2 || kop.addressLine2 || ''
  const phone = header.phone || kop.phone || 'Telp. (021) 1234567'

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  }

  const thinBorder = {
    style: BorderStyle.SINGLE,
    size: 6,
    color: '000000',
  }

  const paragraphs: (Paragraph | Table)[] = []

  // Top Header Grid Table: [Logo Box (15%)] [Institution Title & Address (85%)]
  const logoChildren: Paragraph[] = []
  if (typeof logoUrl === 'string' && logoUrl.startsWith('data:image/')) {
    const [meta, encoded] = logoUrl.split(',')
    const mimeMatch = /^data:(image\/(?:png|jpeg));base64$/.exec(meta)
    const mime = mimeMatch?.[1]
    if (encoded && mime) {
      try {
        logoChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: Buffer.from(encoded, 'base64'),
                type: mime === 'image/jpeg' ? 'jpg' : 'png',
                transformation: { width: 60, height: 60 },
              }),
            ],
          })
        )
      } catch {}
    }
  }

  if (logoChildren.length === 0) {
    logoChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'LOGO', bold: true, size: 14, color: '666666' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'SEKOLAH', bold: true, size: 14, color: '666666' })],
      })
    )
  }

  const titleChildren: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: institutionName,
          bold: true,
          size: 28,
        }),
      ],
    }),
  ]

  if (institutionSubName) {
    titleChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `“${institutionSubName}”`,
            bold: true,
            size: 24,
          }),
        ],
      })
    )
  }

  titleChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: addressLine1, size: 18 })],
    })
  )

  if (addressLine2) {
    titleChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: addressLine2, size: 18 })],
      })
    )
  }

  if (phone) {
    titleChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: phone, size: 18 })],
      })
    )
  }

  const topKopGrid = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: noBorder,
            children: logoChildren,
          }),
          new TableCell({
            width: { size: 85, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: noBorder,
            children: titleChildren,
          }),
        ],
      }),
    ],
  })

  paragraphs.push(topKopGrid)

  // Double Line Divider
  paragraphs.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.DOUBLE, size: 18, color: '000000' },
      },
      text: '',
    })
  )

  // 2-Column Section Table: [Metadata Kiri (60%)] [Nilai & Paraf Box Kanan (40%)]
  const metadataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: noBorder,
    rows: [
      ['Nama', ': ............................................'],
      ['Kelas', `: ${header.groupName || 'B2'}`],
      ['Hari/Tanggal', ': ............................................'],
      ['Bidang Studi', `: ${header.subject || 'Bahasa'}`],
    ].map(
      ([label, val]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: noBorder,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: noBorder,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: val, size: 18 })],
                }),
              ],
            }),
          ],
        })
    ),
  })

  const nilaiParafBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            rowSpan: 2,
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Nilai', bold: true, size: 18 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Paraf', bold: true, size: 18 })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 32.5, type: WidthType.PERCENTAGE },
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Guru', size: 16 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 32.5, type: WidthType.PERCENTAGE },
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Orang Tua', size: 16 })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [new Paragraph({ text: '\n\n' })],
          }),
          new TableCell({
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [new Paragraph({ text: '\n\n' })],
          }),
          new TableCell({
            borders: {
              top: thinBorder,
              bottom: thinBorder,
              left: thinBorder,
              right: thinBorder,
            },
            children: [new Paragraph({ text: '\n\n' })],
          }),
        ],
      }),
    ],
  })

  const headerGrid = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [metadataTable],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [nilaiParafBox],
          }),
        ],
      }),
    ],
  })

  paragraphs.push(headerGrid, new Paragraph({ text: '' }))

  return paragraphs
}

function renderMultipleChoiceQuestion(options: any[], children: (Paragraph | Table)[]) {
  const runs: Array<TextRun | ImageRun> = []
  for (const [index, option] of options.entries()) {
    const defaultLabel = String.fromCodePoint(97 + index)
    const label =
      typeof option === 'string' ? defaultLabel : option.label?.toLowerCase() || defaultLabel
    const text = typeof option === 'string' ? option : option.text || ''
    runs.push(
      new TextRun({ text: `${label}. `, bold: true, font: 'Times New Roman' }),
      ...(imageRunFromData(option?.imageUrl || option?.image, 32, 32)
        ? [imageRunFromData(option?.imageUrl || option?.image, 32, 32)!]
        : option?.imagePrompt
          ? [new TextRun({ text: '[Gambar belum tersedia] ', italics: true, size: 16 })]
          : []),
      new TextRun({ text: `${text}          `, font: 'Times New Roman' })
    )
  }
  children.push(
    new Paragraph({
      indent: { left: 360 },
      children: runs,
    })
  )
}

function imageRunFromData(value: unknown, width: number, height: number): ImageRun | null {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return null
  const [meta, encoded] = value.split(',')
  const mimeMatch = /^data:(image\/(?:png|jpeg));base64$/.exec(meta)
  if (!encoded || !mimeMatch?.[1]) return null
  try {
    return new ImageRun({
      data: Buffer.from(encoded, 'base64'),
      type: mimeMatch[1] === 'image/jpeg' ? 'jpg' : 'png',
      transformation: { width, height },
    })
  } catch {
    return null
  }
}

function renderMatchingQuestion(q: Record<string, any>, children: (Paragraph | Table)[]) {
  const leftItems = Array.isArray(q.leftItems) ? q.leftItems : []
  const rightItems = Array.isArray(q.rightItems) ? q.rightItems : []
  const rowCount = Math.max(leftItems.length, rightItems.length, 2)
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  }

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: noBorder,
    rows: Array.from({ length: rowCount }, (_, index) => {
      const left = leftItems[index]
      const right = rightItems[index]
      const leftLabel = typeof left === 'string' ? left : left?.label || left?.text || ''
      const rightLabel = typeof right === 'string' ? right : right?.label || right?.text || ''
      const leftImage = typeof left === 'object' ? left?.imageUrl || left?.image : undefined

      const itemParagraph = (
        label: string,
        image: unknown,
        imagePrompt: unknown,
        alignment: (typeof AlignmentType)[keyof typeof AlignmentType],
        requireImage = false
      ) => {
        const itemChildren: (TextRun | ImageRun)[] = []
        const imageRun = imageRunFromData(image, 32, 32)
        if (imageRun) itemChildren.push(imageRun)
        if (!imageRun && (requireImage || imagePrompt)) {
          itemChildren.push(new TextRun({ text: 'Gambar belum tersedia', italics: true, size: 14 }))
        }
        if (!imageRun && !requireImage && !imagePrompt) {
          itemChildren.push(new TextRun({ text: label || 'Gambar belum tersedia', bold: true }))
        }
        return new Paragraph({ alignment, children: itemChildren })
      }

      const matchingPrompt = left?.imagePrompt

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              itemParagraph(leftLabel, leftImage, matchingPrompt, AlignmentType.RIGHT, true),
            ],
          }),
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: '●', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [new Paragraph({ text: '' })],
          }),
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: '●', bold: true })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [itemParagraph(rightLabel, undefined, undefined, AlignmentType.LEFT)],
          }),
        ],
      })
    }),
  })
  children.push(table, new Paragraph({ text: '' }))
}

function examAssetMessage(question: Record<string, any>, fallback: string): string {
  if (question.assetStatus === 'quota_unavailable') {
    return 'Ilustrasi tidak dibuat karena kuota generate gambar habis.'
  }
  if (question.assetStatus === 'failed') {
    return 'Ilustrasi belum tersedia. Generate ulang setelah konfigurasi AI diperbaiki.'
  }
  return fallback
}

function renderQuestionImage(
  imageUrl: unknown,
  children: (Paragraph | Table)[],
  missingMessage?: string
) {
  const imageRun = imageRunFromData(imageUrl, 360, 220)
  if (imageRun) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [imageRun] }))
  } else if (missingMessage) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `[${missingMessage}]`, italics: true, size: 16 })],
      })
    )
  }
}

function renderAnswerLines(children: (Paragraph | Table)[], count = 3) {
  for (let line = 0; line < count; line++) {
    children.push(
      new Paragraph({
        indent: { left: 360 },
        children: [
          new TextRun({
            text: '........................................................................................................................',
          }),
        ],
      })
    )
  }
}

function renderVerticalMathQuestion(q: Record<string, any>, children: (Paragraph | Table)[]) {
  const problems = Array.isArray(q.mathProblems) ? q.mathProblems : []
  if (problems.length === 0) {
    renderAnswerLines(children, 2)
    return
  }
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
    right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  }
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: noBorder,
      rows: [
        new TableRow({
          children: problems.map(
            (problem: Record<string, any>) =>
              new TableCell({
                borders: noBorder,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `${problem.topNumber ?? ''}\n${problem.operator ?? '-'} ${problem.bottomNumber ?? ''}\n────────`,
                        font: 'Courier New',
                        bold: true,
                      }),
                    ],
                  }),
                ],
              })
          ),
        }),
      ],
    })
  )
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
  ]

  if (q.instruction) {
    children.push(
      new Paragraph({ children: [new TextRun({ text: q.instruction, italics: true, size: 18 })] })
    )
  }

  let imageRendered = false
  if (!isMatching && Array.isArray(q.options) && q.options.length > 0) {
    renderMultipleChoiceQuestion(q.options, children)
  } else if (isMatching) {
    renderMatchingQuestion(q, children)
  } else if (q.type === 'tracing') {
    if (q.imageUrl) {
      renderQuestionImage(q.imageUrl, children, 'Ilustrasi tracing belum tersedia')
      imageRendered = true
    } else if (q.imagePrompt) {
      renderQuestionImage(null, children, examAssetMessage(q, 'Ilustrasi tracing belum tersedia'))
    } else {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: q.traceText || q.question || 'Tebalkan',
              bold: true,
              size: 32,
              color: '777777',
              underline: { type: UnderlineType.DOTTED },
            }),
          ],
        })
      )
    }
  } else if (q.type === 'coloring') {
    renderQuestionImage(
      q.imageUrl,
      children,
      examAssetMessage(q, 'Ilustrasi mewarnai belum tersedia')
    )
    imageRendered = true
  } else if (q.type === 'count_and_circle') {
    const countItems = Array.isArray(q.countItems)
      ? q.countItems
      : [{ count: 4, options: [3, 4, 5] }]
    for (const item of countItems) {
      const imageRun = imageRunFromData(item.imageUrl, 28, 28)
      const imagePlaceholder = !imageRun
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...(imageRun
              ? [imageRun]
              : imagePlaceholder
                ? [new TextRun({ text: '[Gambar belum tersedia] ', italics: true, size: 14 })]
                : []),
            new TextRun({
              text: `${imageRun || imagePlaceholder ? '' : `${'● '.repeat(Math.max(1, Number(item.count) || 1))}   `}${(item.options || [3, 4, 5]).join('   ')}`,
              size: 24,
            }),
          ],
        })
      )
    }
  } else if (q.type === 'vertical_math') {
    renderVerticalMathQuestion(q, children)
  } else if (q.type === 'fill_blank_image' || q.type === 'visual') {
    renderQuestionImage(q.imageUrl, children, examAssetMessage(q, 'Gambar soal belum tersedia'))
    imageRendered = true
    renderAnswerLines(children, 1)
  } else if (['essay', 'visual', 'practical', 'oral'].includes(q.type)) {
    renderAnswerLines(children)
  }

  if (!imageRendered && q.imageUrl) renderQuestionImage(q.imageUrl, children)
  children.push(new Paragraph({ text: '' }))
  return children
}

function examQuestionSectionLabel(q: Record<string, any>): string {
  const labels: Record<string, string> = {
    multiple_choice: 'Pilihan Ganda',
    matching: 'Hubungkan Garis',
    coloring: 'Warnai Sesuai Petunjuk',
    tracing: 'Tebalkan',
    fill_blank_image: 'Tulis Nama Gambar',
    count_and_circle: 'Hitung dan Lingkari',
    vertical_math: 'Hitung Bersusun',
    practical: 'Praktik',
    oral: 'Kegiatan Lisan',
    essay: 'Uraian',
    visual: 'Aktivitas Visual',
  }
  return labels[q.type] || 'Aktivitas'
}

function examQuestionParagraphsWithSections(questions: Record<string, any>[]) {
  let previousSection = ''
  const paragraphs: (Paragraph | Table)[] = []

  for (const [index, question] of questions.entries()) {
    const section = examQuestionSectionLabel(question)
    if (section !== previousSection) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: section, bold: true, size: 20 })],
        })
      )
      previousSection = section
    }
    paragraphs.push(...examQuestionParagraphs(question, index + 1))
  }

  return paragraphs
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

export function createExamDocument(exam: Exam, user: User) {
  const questionParagraphs = examQuestionParagraphsWithSections(exam.questions)

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12250, height: 20650 },
            margin: { top: 343, right: 500, bottom: 275, left: 500, header: 708, footer: 708 },
          },
        },
        children: [...examHeaderParagraphs(exam, user), ...questionParagraphs],
      },
    ],
  })
}

export async function exportExam(exam: Exam, user: User) {
  await consumeExport(user)
  return toBuffer(createExamDocument(exam, user))
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
