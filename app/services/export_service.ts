import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
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
import { groupWorksheetQuestions } from '#services/exam_worksheet_layout_service'
import { rasterizeSvgSync, readRasterAssetSync } from '#services/visual_asset_service'
import {
  formatRpmClassCover,
  formatRpmClassGroupDetail,
  formatRpmClassShortCode,
  detectInstitutionInfo,
} from '#services/class_formatter'
import {
  loadWeeklyPlanAssessments,
  type LoadedWeeklyAssessments,
  type StudentChecklistGroup,
} from '#services/weekly_assessment_loader'

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
  return toBuffer(
    new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Arial',
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line height (240 * 1.15 = 276 twips)
              },
            },
          },
        },
      },
      sections: [{ children }],
    })
  )
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
  const logoImage = imageRunFromData(logoUrl, 60, 60)
  if (logoImage) {
    logoChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [logoImage],
      })
    )
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

  paragraphs.push(
    topKopGrid,
    // Double Line Divider
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
    const imageRun = imageRunFromData(option?.imageUrl || option?.image, 32, 32)
    runs.push(new TextRun({ text: `${label}. `, bold: true, font: 'Times New Roman' }))
    if (imageRun) runs.push(imageRun)
    else if (option?.imagePrompt) {
      runs.push(new TextRun({ text: '[Gambar belum tersedia] ', italics: true, size: 16 }))
    }
    runs.push(new TextRun({ text: `${text}          `, font: 'Times New Roman' }))
  }
  children.push(
    new Paragraph({
      indent: { left: 360 },
      children: runs,
    })
  )
}

function imageRunFromData(value: unknown, width: number, height: number): ImageRun | null {
  if (typeof value !== 'string') return null
  if (value.startsWith('/') && /\.(?:svg|png|jpe?g)(?:$|\?)/i.test(value)) {
    try {
      const isSvg = /\.svg(?:$|\?)/i.test(value)
      const raster = isSvg ? null : readRasterAssetSync(value)
      return new ImageRun({
        data: raster ? raster.data : rasterizeSvgSync(value, width, height),
        type: raster?.type || 'png',
        transformation: { width, height },
      })
    } catch {
      return null
    }
  }
  if (value.startsWith('data:image/svg+xml')) {
    try {
      const [meta, encoded] = value.split(',', 2)
      if (!encoded) return null
      const svg = /;base64/i.test(meta)
        ? Buffer.from(encoded, 'base64').toString('utf8')
        : decodeURIComponent(encoded)
      return new ImageRun({
        data: rasterizeSvgSync(svg, width, height),
        type: 'png',
        transformation: { width, height },
      })
    } catch {
      return null
    }
  }
  if (!value.startsWith('data:image/')) return null
  const [meta, encoded] = value.split(',')
  const mimeMatch = /^data:(image\/(?:png|jpeg));base64$/i.exec(meta)
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

function circledNumber(value: number): string {
  const circled = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫']
  return circled[value] || `(${value})`
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
  } else if (q.type === 'number_writing') {
    const values = String(q.traceText || q.answer || q.question)
      .split(/[,;\n]+/)
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 5)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: values.map(
          (value) =>
            new TextRun({
              text: `${value}    `,
              bold: true,
              size: 28,
              color: '777777',
              underline: { type: UnderlineType.DOTTED },
            })
        ),
      })
    )
  } else if (q.type === 'count_and_circle') {
    const countItems = Array.isArray(q.countItems)
      ? q.countItems
      : [{ count: 4, options: [3, 4, 5] }]
    for (const [index, item] of countItems.slice(0, 5).entries()) {
      const itemChildren: Array<TextRun | ImageRun> = [
        new TextRun({
          text: `${item.sectionItemLetter || String.fromCodePoint(97 + index)}. `,
          bold: true,
          size: 20,
        }),
      ]
      const count = Math.max(1, Number(item.count) || index + 1)
      let imageCount = 0
      for (let imageIndex = 0; imageIndex < count; imageIndex += 1) {
        const imageRun = imageRunFromData(item.imageUrl, 28, 28)
        if (imageRun) {
          itemChildren.push(imageRun)
          imageCount += 1
        }
      }
      if (imageCount === 0) {
        itemChildren.push(
          new TextRun({ text: '[Gambar belum tersedia] ', italics: true, size: 14 })
        )
      }
      const options = Array.isArray(item.options) ? item.options.slice(0, 4) : [3, 4, 5]
      itemChildren.push(
        new TextRun({
          text: `   ${options.map((option: unknown) => circledNumber(Number(option))).join('   ')}`,
          size: 24,
        })
      )
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: itemChildren,
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

function examQuestionParagraphsWithSections(questions: Record<string, any>[]) {
  const paragraphs: (Paragraph | Table)[] = []

  for (const group of groupWorksheetQuestions(questions)) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: `${group.letter}. ${group.title}`, bold: true, size: 20 })],
      })
    )
    for (const [index, question] of group.questions.entries()) {
      paragraphs.push(
        ...examQuestionParagraphs(question, question.sectionQuestionNumber || index + 1)
      )
    }
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

  const docStyles = {
    default: {
      document: {
        run: { font: 'Arial' },
        paragraph: { spacing: { line: 276 } },
      },
    },
  }

  const doc = new Document({
    styles: docStyles,
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
    styles: {
      default: {
        document: {
          run: { font: 'Arial' },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
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
    styles: {
      default: {
        document: {
          run: { font: 'Arial' },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
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

export async function exportWeeklyLessonPlan(
  weekly: WeeklyLessonPlan,
  user: User,
  loadedAssessments?: LoadedWeeklyAssessments
) {
  await consumeExport(user)

  const content = weekly.content ?? {}
  const isRpm = Boolean(
    content.identification || content.learningExperience || content.learningDesign
  )

  if (!isRpm) {
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
    for (const [key, value] of Object.entries(content)) {
      if (key === 'curriculum') continue
      children.push(...sectionParagraphs(key, contentValue(value)))
    }
    return documentFromChildren(children)
  }

  const assessments = loadedAssessments || (await loadWeeklyPlanAssessments(weekly))

  // RPM KBC RA (Deep Learning) 12-Page Comprehensive Matrix Layout
  const borderlessBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  }

  const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
  const lavenderBorder = { style: BorderStyle.SINGLE, size: 1, color: 'D8B4FE' }
  const tableBorders = {
    top: thinBorder,
    bottom: thinBorder,
    left: thinBorder,
    right: thinBorder,
    insideHorizontal: thinBorder,
    insideVertical: thinBorder,
  }

  const instInfo = detectInstitutionInfo(user.schoolName, user.educationLevel)
  const shortGroupStr = formatRpmClassShortCode(weekly.schoolClass, user, content.groupContext)
  const shortSemesterWeekStr = `${content.semester || 1}/${content.weekNumber || 1}`
  const groupCoverStr = formatRpmClassCover(weekly.schoolClass, user, content.groupContext)
  const groupDetailStr = formatRpmClassGroupDetail(weekly.schoolClass, content.groupContext)
  const themeUpper = (weekly.theme || 'AKU HAMBA ALLAH').toUpperCase()
  const subthemeUpper = (content.subtheme || 'AYO KITA BERKENALAN').toUpperCase()

  const children: (Paragraph | Table)[] = [
    // 1. Cover Page - Header Bar & Ministry Title
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 16, color: 'EA580C' },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: 'FDBA74' },
      },
      spacing: { after: 120 },
      children: [],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: instInfo.ministry,
          bold: true,
          size: 20, // 10pt
          color: '9A3412',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: instInfo.subtitle,
          size: 18, // 9pt
          color: '64748B',
        }),
      ],
    }),

    // Cover Hero Card (Orange Theme)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: 'F97316' },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: 'F97316' },
        left: { style: BorderStyle.SINGLE, size: 6, color: 'F97316' },
        right: { style: BorderStyle.SINGLE, size: 6, color: 'F97316' },
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'FFF7ED' },
              margins: { top: 180, bottom: 180, left: 180, right: 180 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 50 },
                  children: [
                    new TextRun({
                      text: 'RENCANA PEMBELAJARAN MENDALAM (RPM)',
                      bold: true,
                      size: 26, // 13pt
                      color: 'C2410C',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 100 },
                  children: [
                    new TextRun({
                      text: 'RENCANA PELAKSANAAN PEMBELAJARAN MINGGUAN (RPPM)',
                      bold: true,
                      size: 20, // 10pt
                      color: 'EA580C',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: 'FED7AA' } },
                  spacing: { after: 120 },
                  children: [],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 70 },
                  children: [
                    new TextRun({
                      text: themeUpper,
                      bold: true,
                      size: 32, // 16pt
                      color: '9A3412',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 70 },
                  children: [
                    new TextRun({
                      text: `SUB TOPIK : ${subthemeUpper}`,
                      bold: true,
                      size: 26, // 13pt
                      color: 'C2410C',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `JENJANG / KELAS : ${groupCoverStr.toUpperCase()}`,
                      bold: true,
                      size: 19, // 9.5pt
                      color: '64748B',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { before: 150 } }),

    // Metadata Card (Clean card with borderless inner table to avoid boxed colons)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: thinBorder,
        bottom: thinBorder,
        left: thinBorder,
        right: thinBorder,
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              columnSpan: 3,
              shading: { fill: 'F1F5F9' },
              borders: {
                top: borderlessBorders.top,
                bottom: thinBorder,
                left: borderlessBorders.left,
                right: borderlessBorders.right,
              },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'INFORMASI PERANGKAT PEMBELAJARAN',
                      bold: true,
                      size: 20,
                      color: '334155',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ...[
          ['PENULIS', user.fullName || 'Guru Kelas'],
          ['SATUAN PENDIDIKAN', user.schoolName || 'RA / TK PAUD'],
          ['KELOMPOK / USIA', groupDetailStr],
          ['TOPIK', themeUpper],
          ['SUB TOPIK', subthemeUpper],
          ['SEMESTER / MINGGU', shortSemesterWeekStr],
          ['ALOKASI WAKTU', String(content.allocation || '5 Hari x 180 Menit (15 JP)')],
        ].map(
          ([lbl, val]) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 28, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F8FAFC' },
                  borders: borderlessBorders,
                  margins: { top: 60, bottom: 60, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: lbl, bold: true, size: 18, color: '475569' })],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 4, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F8FAFC' },
                  borders: borderlessBorders,
                  margins: { top: 60, bottom: 60, left: 50, right: 50 },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: ':', bold: true, size: 18, color: '475569' })],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 68, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F8FAFC' },
                  borders: borderlessBorders,
                  margins: { top: 60, bottom: 60, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: val || '-',
                          bold: true,
                          size: 18,
                          color: '0F172A',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
        ),
      ],
    }),
    new Paragraph({ spacing: { before: 180 } }),

    // Cover Footer
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `TAHUN PELAJARAN ${new Date().getFullYear()} / ${new Date().getFullYear() + 1}`,
          bold: true,
          size: 20,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: 'EA580C' } },
      children: [],
    }),

    // Page break to Page 2
    new Paragraph({ pageBreakBefore: true }),

    // Page 2 Header Banner (Orange bar matching PDF header)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'C2410C' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'C2410C' },
        left: { style: BorderStyle.SINGLE, size: 4, color: 'C2410C' },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'C2410C' },
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'EA580C' },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `RENCANA PEMBELAJARAN MENDALAM (RPM) - ${instInfo.level} FASE FONDASI`,
                      bold: true,
                      size: 18,
                      color: 'FFFFFF',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' }),
  ]

  // Helper Banner Lavender
  const createLavenderBanner = (title: string) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: lavenderBorder,
        bottom: lavenderBorder,
        left: lavenderBorder,
        right: lavenderBorder,
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: title, bold: true, size: 20, color: '581C87' })],
                }),
              ],
            }),
          ],
        }),
      ],
    })

  // SECTION A: IDENTIFIKASI PEMBELAJARAN
  const idf = content.identification || {}
  children.push(
    createLavenderBanner('A. IDENTIFIKASI PEMBELAJARAN & NILAI KARAKTER'),
    new Paragraph({ text: '' }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Karakteristik Murid',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        idf.studentCharacteristics ||
                        'Peserta didik aktif, senang bereksplorasi sensorik-motorik, dan memiliki rasa ingin tahu tinggi.',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Materi Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• Esensial: ${idf.essentialMaterials || idf.essentialMaterial || weekly.theme}`,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• Aplikatif: ${idf.practicalMaterials || idf.appliedMaterial || content.subtheme || weekly.theme}`,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• Nilai & Karakter: ${idf.valueMaterials || idf.valueMaterial || 'Kasih sayang dan rasa syukur kepada Allah SWT'}`,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Dimensi Profil Lulusan (DPL)',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: (Array.isArray(idf.dpl) && idf.dpl.length > 0
                ? idf.dpl
                : ['DPL 1: Keimanan & Ketakwaan', 'DPL 3: Penalaran Kritis']
              ).map(
                (d: string) =>
                  new Paragraph({
                    children: [new TextRun({ text: `• ${d}`, size: 18, color: '0F172A' })],
                  })
              ),
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Nilai Panca Cinta KBC',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: (Array.isArray(idf.pancaCintaValues || idf.kbcValues) &&
              (idf.pancaCintaValues || idf.kbcValues).length > 0
                ? idf.pancaCintaValues || idf.kbcValues
                : ['Cinta Alloh & RosulNya', 'Cinta Diri & Sesama', 'Cinta Lingkungan']
              ).map(
                (v: string) =>
                  new Paragraph({
                    children: [new TextRun({ text: `• ${v}`, size: 18, color: '0F172A' })],
                  })
              ),
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' })
  )

  // SECTION B: DESAIN PEMBELAJARAN (Matriks Tabel 2-Kolom)
  const ld = content.learningDesign || {}
  const cpParagraphs = (
    Array.isArray(ld.cpElements) && ld.cpElements.length > 0
      ? ld.cpElements
      : [
          'CP Nilai Agama & Budi Pekerti: Anak mengenal Allah SWT & ciptaan-Nya',
          'CP Jati Diri: Anak mengenali identitas diri & emosi',
          'CP Dasar Literasi & STEAM: Anak mengeksplorasi media loose parts',
        ]
  ).map(
    (cp: string) =>
      new Paragraph({ children: [new TextRun({ text: `• ${cp}`, size: 18, color: '0F172A' })] })
  )

  const tpParagraphs = (
    Array.isArray(ld.learningObjectives) && ld.learningObjectives.length > 0
      ? ld.learningObjectives
      : [
          {
            code: 'TP 1',
            title: 'Anak mengenal dan memahami identitas dirinya serta ciptaan Allah',
          },
        ]
  ).map((tp: any, idx: number) => {
    const title = typeof tp === 'string' ? tp : tp?.title || tp?.name || ''
    const code = typeof tp === 'object' && tp?.code ? tp.code : `TP ${idx + 1}`
    return new Paragraph({
      children: [new TextRun({ text: `• [${code}] ${title}`, size: 18, color: '0F172A' })],
    })
  })

  let pedStr =
    'Menggunakan pendekatan bermain sebagai cara alami anak belajar, bercerita untuk membangun pemahaman, bernyanyi untuk menciptakan suasana menyenangkan, dan eksplorasi langsung dengan media loose parts.'
  if (typeof ld.pedagogicalPractices === 'object' && ld.pedagogicalPractices !== null) {
    pedStr = `Mindful: ${ld.pedagogicalPractices.mindful || '-'}\nMeaningful: ${ld.pedagogicalPractices.meaningful || '-'}\nJoyful: ${ld.pedagogicalPractices.joyful || '-'}`
  } else if (typeof ld.pedagogicalPractices === 'string' && ld.pedagogicalPractices.trim()) {
    pedStr = ld.pedagogicalPractices
  }

  children.push(
    createLavenderBanner('B. DESAIN PEMBELAJARAN'),
    new Paragraph({ text: '' }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Capaian Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: cpParagraphs,
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Lintas Disiplin Ilmu',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        ld.crossDisciplinaryConcepts ||
                        ld.crossDisciplinary ||
                        'Nilai agama dan moral, sosial emosional, fisik motorik, kognitif, bahasa, seni',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Tujuan Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: tpParagraphs,
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Topik Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${weekly.theme} : ${content.subtheme || 'Ayo Kita Berkenalan'}`,
                      bold: true,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Praktik Pedagogis (Deep Learning)',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: pedStr.split('\n').map(
                (p) =>
                  new Paragraph({
                    children: [new TextRun({ text: p, size: 18, color: '0F172A' })],
                  })
              ),
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Kemitraan Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        ld.partnerships ||
                        'Guru kelas, orang tua/keluarga, teman sebaya dalam kelompok bermain, dan komunitas sekolah.',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Lingkungan Pembelajaran',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text:
                        ld.learningEnvironment ||
                        'Ruang kelas fleksibel dengan area bermain loose parts, lingkungan outdoor untuk eksplorasi fisik.',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'FAF5FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Pemanfaatan Digital',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '• Perencanaan: Persiapan media lagu dan audio/video interaktif',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '• Pelaksanaan: Dokumentasi foto & video proses main anak',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '• Asesmen: Portofolio digital karya anak',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' })
  )

  // SECTION C: PENGALAMAN BELAJAR
  const exp = content.learningExperience || {}
  children.push(
    createLavenderBanner('C. PENGALAMAN BELAJAR'),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'RENCANA PELAKSANAAN PEMBELAJARAN / LANGKAH-LANGKAH PEMBELAJARAN',
          bold: true,
          size: 19,
          color: '1E293B',
        }),
      ],
    }),
    new Paragraph({ text: '' }),

    // C.1 AWAL
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: lavenderBorder,
        bottom: lavenderBorder,
        left: lavenderBorder,
        right: lavenderBorder,
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F5F3FF' },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'C.1. AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)',
                      bold: true,
                      size: 18,
                      color: '6B21A8',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: 'Pembuka dari proses pembelajaran yang bertujuan untuk mempersiapkan peserta didik sebelum memasuki inti pembelajaran. Kegiatan dalam tahap ini meliputi orientasi yang bermakna, apersepsi yang kontekstual, dan motivasi yang menggembirakan:',
          size: 18,
          italics: true,
          color: '334155',
        }),
      ],
    })
  )

  const openActs =
    Array.isArray(exp.openingActivities) && exp.openingActivities.length > 0
      ? exp.openingActivities
      : [
          'Salam dan doa pembuka dengan penuh kesadaran',
          'Renungan/nasehat/motivasi pagi yang bermakna',
          'Menyanyikan lagu ceria tentang tema pembelajaran',
          'Asesmen awal melalui diskusi ide kegiatan hari ini',
          'Kegiatan pemantik berupa cerita/video interaktif',
          'Menyiapkan kesepakatan kelas dan aturan bermain',
          'Pertanyaan pemantik untuk mengembangkan dimensi profil lulusan:',
        ]

  openActs.forEach((act: string, idx: number) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${idx + 1}. ${act}`, size: 18, color: '0F172A' })],
      })
    )
  })

  const openQuestions =
    Array.isArray(exp.openingQuestions) && exp.openingQuestions.length > 0
      ? exp.openingQuestions
      : [
          'Siapa yang bisa menceritakan pengalamannya tentang tema ini dengan suara jelas? (Komunikasi)',
          'Apa yang membuat dirimu dan ciptaan Tuhan ini istimewa? (Keimanan & Ketakwaan)',
          'Bagaimana cara kita menghargai dan bekerja sama dengan teman? (Kewargaan & Kolaborasi)',
          'Apa yang bisa kamu lakukan secara mandiri hari ini? (Kemandirian)',
        ]

  openQuestions.forEach((q: string, qIdx: number) => {
    const letter = String.fromCodePoint(97 + qIdx)
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `    ${letter}) "${q}"`, size: 17, italics: true, color: '475569' }),
        ],
      })
    )
  })

  children.push(
    new Paragraph({ text: '' }),
    // C.2 INTI
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: lavenderBorder,
        bottom: lavenderBorder,
        left: lavenderBorder,
        right: lavenderBorder,
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F5F3FF' },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'C.2. INTI', bold: true, size: 18, color: '6B21A8' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: 'Pada tahap ini, anak aktif terlibat dalam pengalaman belajar memahami, mengaplikasi, dan merefleksi. Guru menerapkan prinsip pembelajaran berkesadaran, bermakna, menggembirakan untuk mencapai tujuan pembelajaran.',
          size: 18,
          italics: true,
          color: '334155',
        }),
      ],
    })
  )

  // Tabel Pengalaman Belajar Inti Harian
  const coreDays = Array.isArray(exp.dailyCoreActivities) ? exp.dailyCoreActivities : []
  const coreTableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          shading: { fill: 'E9D5FF' },
          borders: tableBorders,
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Hari', bold: true, size: 18, color: '581C87' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 88, type: WidthType.PERCENTAGE },
          shading: { fill: 'E9D5FF' },
          borders: tableBorders,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Uraian Kegiatan Inti Bermain Bermakna & Loose Parts',
                  bold: true,
                  size: 18,
                  color: '581C87',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]

  coreDays.forEach((d: any, dayIdx: number) => {
    const actParas: Paragraph[] = []
    if (d.stage) {
      actParas.push(
        new Paragraph({
          shading: { fill: 'F3E8FF' },
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `TAHAP: ${d.stage}`, bold: true, size: 17, color: '6B21A8' }),
          ],
        })
      )
    }

    let details: any[] = []
    if (Array.isArray(d.activitiesDetail) && d.activitiesDetail.length > 0) {
      details = d.activitiesDetail
    } else {
      const fallbackActs = Array.isArray(d.activities) ? d.activities : []
      details = fallbackActs.map((a: string, aIdx: number) => ({
        name: `Kegiatan ${aIdx + 1} : ${a}`,
        focus: d.steamFocus || d.kbcFocus || 'Eksplorasi Loose Parts',
        materials: d.mediaLooseParts || 'Bahan alam, loose parts',
        instructions: 'Anak bereksplorasi secara aktif dan mandiri bersama kelompok main.',
        benefits: 'Melatih kreativitas, daya pikir kritis, dan kemandirian.',
      }))
    }

    details.forEach((item: any, iIdx: number) => {
      const defaultName = `Kegiatan ${iIdx + 1}`
      const baseName = item.name || defaultName
      const focusStr = item.focus ? ` (${item.focus})` : ''
      const actTitle = baseName + focusStr

      actParas.push(
        new Paragraph({
          spacing: { before: iIdx > 0 ? 80 : 0 },
          children: [new TextRun({ text: actTitle, bold: true, size: 18, color: '0F172A' })],
        })
      )

      if (item.materials) {
        actParas.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Alat dan Bahan: ', bold: true, size: 18, color: '475569' }),
              new TextRun({ text: item.materials, size: 18, color: '334155' }),
            ],
          })
        )
      }

      actParas.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Cara Bermain / Membuat: ',
              bold: true,
              size: 18,
              color: '1E293B',
            }),
            new TextRun({
              text: item.instructions || 'Anak bereksplorasi secara aktif dan mandiri.',
              size: 18,
              color: '334155',
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Manfaat Kegiatan: ', bold: true, size: 18, color: '1E293B' }),
            new TextRun({
              text: item.benefits || 'Melatih daya pikir kritis dan kemandirian.',
              size: 18,
              italics: true,
              color: '475569',
            }),
          ],
        })
      )
    })

    coreTableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 100, bottom: 100, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: String(dayIdx + 1), bold: true, size: 24, color: '0F172A' }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: d.day || `Hari ${dayIdx + 1}`,
                    bold: true,
                    size: 16,
                    color: '475569',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 88, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: actParas,
          }),
        ],
      })
    )
  })

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: coreTableRows,
    }),
    new Paragraph({ text: '' }),

    // C.3 PENUTUP
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: lavenderBorder,
        bottom: lavenderBorder,
        left: lavenderBorder,
        right: lavenderBorder,
        insideHorizontal: borderlessBorders.insideHorizontal,
        insideVertical: borderlessBorders.insideVertical,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { fill: 'F5F3FF' },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'C.3. PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)',
                      bold: true,
                      size: 18,
                      color: '6B21A8',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text: 'Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:',
          size: 18,
          italics: true,
          color: '334155',
        }),
      ],
    })
  )

  const closeActs =
    Array.isArray(exp.closingActivities) && exp.closingActivities.length > 0
      ? exp.closingActivities
      : [
          'Recalling kegiatan hari ini dengan bertanya "Apa yang paling menyenangkan hari ini?"',
          'Pameran mini hasil karya dimana setiap anak memamerkan karyanya dengan bangga',
          'Tepuk tangan apresiasi bersama untuk semua pencapaian anak hari ini',
          'Bernyanyi lagu penutup yang ceria tentang kebanggaan diri',
          'Yel-yel semangat untuk kegiatan esok hari',
          'Doa penutup dengan penuh syukur dan persiapan pulang yang gembira',
        ]

  closeActs.forEach((act: string, idx: number) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${idx + 1}. ${act}`, size: 18, color: '0F172A' })],
      })
    )
  })

  children.push(new Paragraph({ text: '' }))

  // SECTION D: ASESMEN PEMBELAJARAN
  const asm = content.assessment || {}
  children.push(
    createLavenderBanner('D. ASESMEN PEMBELAJARAN'),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Asesmen dalam pembelajaran ini dirancang untuk mengamati dan mendokumentasikan perkembangan anak secara alami melalui kegiatan bermain, tanpa membuat anak merasa sedang dievaluasi. Guru menggunakan berbagai teknik observasi yang ramah anak untuk memahami kemajuan setiap individu dalam mengenal identitas diri dan berinteraksi sosial.',
          size: 18,
          italics: true,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Asesmen Awal:', bold: true, size: 18, color: '581C87' })],
    })
  )

  const earlyList =
    Array.isArray(asm.earlyAssessment) && asm.earlyAssessment.length > 0
      ? asm.earlyAssessment
      : [
          'Ajak anak bercerita tentang dirinya sambil bermain boneka atau media interaktif',
          'Minta anak mengekspresikan ide awal terkait tema secara bebas tanpa tekanan',
          'Observasi bagaimana anak memperkenalkan diri kepada teman baru di awal kegiatan',
          'Catat kemampuan anak menyebutkan nama, alamat, dan identitas saat ditanya dengan lembut',
          'Amati tingkat kepercayaan diri anak saat berbicara di depan kelompok kecil',
        ]
  earlyList.forEach((e: string) =>
    children.push(
      new Paragraph({ children: [new TextRun({ text: `• ${e}`, size: 18, color: '0F172A' })] })
    )
  )

  children.push(
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Asesmen Proses:', bold: true, size: 18, color: '581C87' })],
    })
  )
  const processList =
    Array.isArray(asm.processAssessment) && asm.processAssessment.length > 0
      ? asm.processAssessment
      : [
          'Foto dan video anak saat bermain untuk melihat interaksi sosial dan keterampilan motorik',
          'Buat catatan singkat tentang kata-kata santun yang diucapkan anak secara spontan',
          'Dokumentasikan cara anak menyelesaikan tugas mandiri seperti merapikan mainan',
          'Rekam suara anak saat bercerita atau bernyanyi untuk menilai kemampuan komunikasi',
          'Amati bagaimana anak bekerjasama dalam kegiatan kelompok dan menghargai perbedaan teman',
        ]
  processList.forEach((p: string) =>
    children.push(
      new Paragraph({ children: [new TextRun({ text: `• ${p}`, size: 18, color: '0F172A' })] })
    )
  )

  children.push(
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Asesmen Akhir:', bold: true, size: 18, color: '581C87' })],
    })
  )
  const finalList =
    Array.isArray(asm.finalAssessment) && asm.finalAssessment.length > 0
      ? asm.finalAssessment
      : [
          'Minta anak mempresentasikan hasil karyanya dengan cara yang menyenangkan',
          'Ajak anak merefleksi dengan pertanyaan "Apa yang paling berharga yang kamu pelajari hari ini?"',
          'Observasi perubahan sikap anak dari awal hingga akhir pembelajaran',
          'Dokumentasikan kemampuan anak mengekspresikan perasaan dan pengalaman belajarnya',
          'Catat perkembangan kemandirian dan kepercayaan diri anak melalui aktivitas sehari-hari',
        ]
  finalList.forEach((f: string) =>
    children.push(
      new Paragraph({ children: [new TextRun({ text: `• ${f}`, size: 18, color: '0F172A' })] })
    )
  )

  // Lembar Pengesahan Tanda Tangan
  children.push(
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: borderlessBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Mengetahui,', size: 18, color: '0F172A' })],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Kepala RA', bold: true, size: 18, color: '0F172A' }),
                  ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '......................................................',
                      bold: true,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'NIP. ........................................',
                      size: 18,
                      color: '475569',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Guru Kelas / Penyusun,',
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({ text: '' }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `( ${user.fullName || '........................................'} )`,
                      bold: true,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'NIP. ........................................',
                      size: 18,
                      color: '475569',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' })
  )

  // Helper Appendix Header
  const createAppendixHeader = (appendixTitle: string) => [
    new Paragraph({ pageBreakBefore: true }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: instInfo.assessmentHeaderTitle,
          bold: true,
          size: 24,
          color: '581C87',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: appendixTitle, bold: true, size: 20, color: '581C87' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `TAHUN AJARAN : ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          bold: true,
          size: 18,
          color: '581C87',
        }),
      ],
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D8B4FE' } },
      spacing: { after: 100 },
      children: [],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: borderlessBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 16, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Jenjang / Kelas',
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 3, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ':',
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 31, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: shortGroupStr,
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Semester / Minggu',
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 3, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ':',
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 27, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: shortSemesterWeekStr,
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 16, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Guru Kelas',
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 3, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ':',
                      bold: true,
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 31, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: user.fullName || 'Guru Pengampu',
                      size: 18,
                      color: '1E293B',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [new Paragraph({ text: '' })],
            }),
            new TableCell({
              width: { size: 3, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [new Paragraph({ text: '' })],
            }),
            new TableCell({
              width: { size: 27, type: WidthType.PERCENTAGE },
              borders: borderlessBorders,
              children: [new Paragraph({ text: '' })],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' }),
  ]

  // LAMPIRAN 1: CATATAN ANEKDOT
  children.push(
    ...createAppendixHeader('CATATAN ANEKDOT'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 14, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Tanggal', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 18, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Nama Anak', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 34, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Kejadian Teramati',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 34, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Analisis Capaian',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ...(assessments && assessments.anecdotes.length > 0
          ? assessments.anecdotes.map(
              (item) =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 14, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: item.date, size: 18, color: '0F172A' })],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 18, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: item.studentName,
                              bold: true,
                              size: 18,
                              color: '0F172A',
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 34, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: item.event, size: 18, color: '334155' })],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 34, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 80, bottom: 80, left: 80, right: 80 },
                      children: item.analysis.split('\n').map((line) => {
                        const trimmed = line.trim()
                        const isHeader =
                          trimmed.endsWith(':') ||
                          /^Nilai Agama|^Jati Diri|^Dasar Literasi|^STEAM/i.test(trimmed)
                        return new Paragraph({
                          spacing: { after: 20 },
                          children: [
                            new TextRun({
                              text: trimmed,
                              bold: isHeader,
                              size: 17,
                              color: isHeader ? '0F172A' : '334155',
                            }),
                          ],
                        })
                      }),
                    }),
                  ],
                })
            )
          : [1, 2, 3, 4, 5, 6, 7].map(
              () =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 14, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 18, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 34, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 34, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                  ],
                })
            )),
      ],
    })
  )

  // LAMPIRAN 2: CEKLIS IKTP (1 Tabel per Siswa)
  children.push(...createAppendixHeader('CEKLIS IKTP (INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN)'))

  const studentGroups: StudentChecklistGroup[] = assessments?.studentChecklists || []

  for (const [sIdx, studentGroup] of studentGroups.entries()) {
    if (sIdx > 0) {
      children.push(new Paragraph({ spacing: { before: 200 } }))
    }

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorders,
        rows: [
          // Row 1 of 2-tier header
          new TableRow({
            children: [
              new TableCell({
                width: { size: 6, type: WidthType.PERCENTAGE },
                rowSpan: 2,
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 80, bottom: 80, left: 50, right: 50 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'No', bold: true, size: 18, color: '581C87' })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 44, type: WidthType.PERCENTAGE },
                rowSpan: 2,
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 80, bottom: 80, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: 'Indikator', bold: true, size: 18, color: '581C87' }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 22, type: WidthType.PERCENTAGE },
                columnSpan: 2,
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 60, bottom: 60, left: 50, right: 50 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: studentGroup.studentName,
                        bold: true,
                        size: 18,
                        color: '581C87',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                rowSpan: 2,
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 80, bottom: 80, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'Keterangan / Kejadian Teramati',
                        bold: true,
                        size: 18,
                        color: '581C87',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          // Row 2 of 2-tier header (Sudah Muncul / Belum Muncul)
          new TableRow({
            children: [
              new TableCell({
                width: { size: 11, type: WidthType.PERCENTAGE },
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 80, bottom: 80, left: 50, right: 50 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'Sudah Muncul',
                        bold: true,
                        size: 16,
                        color: '581C87',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 11, type: WidthType.PERCENTAGE },
                shading: { fill: 'F3E8FF' },
                borders: tableBorders,
                margins: { top: 80, bottom: 80, left: 50, right: 50 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'Belum Muncul',
                        bold: true,
                        size: 16,
                        color: '581C87',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          // Data Rows for this student
          ...studentGroup.items.map(
            (item, idx) =>
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 6, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 50, right: 50 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: String(item.no || idx + 1),
                            size: 18,
                            color: '0F172A',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 44, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: item.indicator, size: 18, color: '0F172A' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 11, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 50, right: 50 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.sudahMuncul ? '✔' : '',
                            font: 'Segoe UI Symbol',
                            bold: true,
                            size: 22,
                            color: '16A34A',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 11, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 50, right: 50 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.belumMuncul ? '✔' : '',
                            font: 'Segoe UI Symbol',
                            bold: true,
                            size: 22,
                            color: 'DC2626',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.note || '',
                            size: 17,
                            color: '334155',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              })
          ),
        ],
      })
    )
  }

  // LAMPIRAN 3: DOKUMENTASI HASIL KARYA
  children.push(
    ...createAppendixHeader('DOKUMENTASI HASIL KARYA'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Tanggal', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 18, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Nama Anak', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Foto Karya Anak', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Deskripsi Foto dan Analisis Capaian Perkembangan',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ...(assessments && assessments.workSamples.length > 0
          ? assessments.workSamples.map((item) => {
              const photoParas: Paragraph[] = []
              let imgLoaded = false
              if (item.storedName) {
                const filePath = join(
                  process.cwd(),
                  'public',
                  'uploads',
                  'assessments',
                  String(user.id),
                  String(item.id),
                  item.storedName
                )
                if (existsSync(filePath)) {
                  try {
                    const imgBuf = readFileSync(filePath)
                    photoParas.push(
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new ImageRun({
                            data: imgBuf,
                            type: 'png',
                            transformation: { width: 140, height: 100 },
                          }),
                        ],
                      })
                    )
                    imgLoaded = true
                  } catch {}
                }
              }
              if (!imgLoaded) {
                photoParas.push(
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: '[ Foto Hasil Karya ]',
                        size: 16,
                        italics: true,
                        color: '94A3B8',
                      }),
                    ],
                  })
                )
              }

              return new TableRow({
                children: [
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: item.date, size: 18, color: '0F172A' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 18, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: item.studentName,
                            bold: true,
                            size: 18,
                            color: '0F172A',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: photoParas,
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Deskripsi:',
                            bold: true,
                            size: 18,
                            color: '1E293B',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: item.description, size: 18, color: '334155' }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Analisis Capaian:',
                            bold: true,
                            size: 18,
                            color: '1E293B',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: item.analysis, size: 18, color: '334155' })],
                      }),
                    ],
                  }),
                ],
              })
            })
          : [1, 2, 3, 4, 5].map(
              () =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 12, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 18, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: '[ Tempel Foto Karya ]',
                              size: 16,
                              italics: true,
                              color: '94A3B8',
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                  ],
                })
            )),
      ],
    }),

    // LAMPIRAN 4: FOTO BERSERI
    ...createAppendixHeader('FOTO BERSERI'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 12, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'Tanggal', bold: true, size: 18, color: '581C87' }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 44, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Nama Anak & Dokumentasi Foto (Minimal 3)',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 44, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3E8FF' },
              borders: tableBorders,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Deskripsi Foto dan Analisis CP',
                      bold: true,
                      size: 18,
                      color: '581C87',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ...(assessments && assessments.photoSeries.length > 0
          ? assessments.photoSeries.map((item) => {
              const photoCellChildren: Paragraph[] = [
                new Paragraph({
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: item.studentName,
                      bold: true,
                      size: 18,
                      color: '0F172A',
                    }),
                  ],
                }),
              ]
              const imgRuns: ImageRun[] = []
              for (const att of item.attachments.slice(0, 3)) {
                if (att.storedName) {
                  const filePath = join(
                    process.cwd(),
                    'public',
                    'uploads',
                    'assessments',
                    String(user.id),
                    String(item.id),
                    att.storedName
                  )
                  if (existsSync(filePath)) {
                    try {
                      const imgBuf = readFileSync(filePath)
                      imgRuns.push(
                        new ImageRun({
                          data: imgBuf,
                          type: 'png',
                          transformation: { width: 75, height: 60 },
                        })
                      )
                    } catch {}
                  }
                }
              }
              if (imgRuns.length > 0) {
                photoCellChildren.push(
                  new Paragraph({
                    children: imgRuns,
                  })
                )
              } else {
                photoCellChildren.push(
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: '[ Foto 1 ]     [ Foto 2 ]     [ Foto 3 ]',
                        size: 16,
                        italics: true,
                        color: '94A3B8',
                      }),
                    ],
                  })
                )
              }

              return new TableRow({
                children: [
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: item.date, size: 18, color: '0F172A' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 44, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: photoCellChildren,
                  }),
                  new TableCell({
                    width: { size: 44, type: WidthType.PERCENTAGE },
                    borders: tableBorders,
                    margins: { top: 80, bottom: 80, left: 80, right: 80 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Judul / Kegiatan:',
                            bold: true,
                            size: 18,
                            color: '1E293B',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: item.description, size: 18, color: '334155' }),
                        ],
                      }),
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Analisis Perkembangan:',
                            bold: true,
                            size: 18,
                            color: '1E293B',
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [new TextRun({ text: item.analysis, size: 18, color: '334155' })],
                      }),
                    ],
                  }),
                ],
              })
            })
          : [1, 2, 3, 4, 5].map(
              () =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 12, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                    new TableCell({
                      width: { size: 44, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: '[ Foto 1 ]     [ Foto 2 ]     [ Foto 3 ]',
                              size: 16,
                              italics: true,
                              color: '94A3B8',
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 44, type: WidthType.PERCENTAGE },
                      borders: tableBorders,
                      margins: { top: 120, bottom: 120, left: 80, right: 80 },
                      children: [new Paragraph({ text: '' })],
                    }),
                  ],
                })
            )),
      ],
    }),
    new Paragraph({
      spacing: { before: 150 },
      children: [
        new TextRun({
          text: 'Catatan: Foto berseri fokus pada proses perkembangan pada satu keterampilan/kegiatan yang sama dari waktu ke waktu; Menunjukkan progres bertahap dalam penguasaan suatu keterampilan.',
          size: 16,
          italics: true,
          color: '475569',
        }),
      ],
    })
  )

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
  const { buildPaudAssessmentDocx } = await import('#services/paud_assessment_export_service')
  return buildPaudAssessmentDocx(assessment, user)
}

export async function exportPaudAssessmentBundle(
  assessments: PaudAssessment[],
  user: User,
  themeTitle = 'Kenalkan'
) {
  await consumeExport(user)
  const { buildPaudAssessmentBundleDocx } = await import('#services/paud_assessment_export_service')
  return buildPaudAssessmentBundleDocx(assessments, user, themeTitle)
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
