import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  ImageRun,
} from 'docx'
import PDFDocument from 'pdfkit'
import type User from '#models/user'
import type PaudAssessment from '#models/paud_assessment'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// -----------------------------------------------------------------------------
// Exact Colors matching PPM KBC PM Kelas B (.docx & .pdf)
// -----------------------------------------------------------------------------
export const PAUD_DOCX_COLORS = {
  BORDER_PURPLE: 'D86DCB',
  HEADER_FILL_PINK: 'F2CEED',
  TEXT_DARK: '111827',
  TEXT_MUTED: '4B5563',
  SUCCESS_GREEN: '16A34A',
  DANGER_RED: 'DC2626',
}

export const PAUD_PDF_COLORS = {
  BORDER_PURPLE: '#D86DCB',
  HEADER_FILL_PINK: '#F2CEED',
  TEXT_DARK: '#111827',
  TEXT_MUTED: '#4B5563',
  SUCCESS_GREEN: '#16A34A',
  DANGER_RED: '#DC2626',
}

const THIN_BORDER = {
  top: { style: BorderStyle.SINGLE, size: 4, color: PAUD_DOCX_COLORS.BORDER_PURPLE },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: PAUD_DOCX_COLORS.BORDER_PURPLE },
  left: { style: BorderStyle.SINGLE, size: 4, color: PAUD_DOCX_COLORS.BORDER_PURPLE },
  right: { style: BorderStyle.SINGLE, size: 4, color: PAUD_DOCX_COLORS.BORDER_PURPLE },
}

const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
}

export interface PaudAssessmentContentParsed {
  theme?: string
  context?: string
  observedEvent?: string
  achievementAnalysis?: string
  workTitle?: string
  workDescription?: string
  activityTitle?: string
  stepDescriptions?: string[]
  items?: Array<{
    indicator: string
    status: 'sudah_muncul' | 'belum_muncul'
    observationNote?: string
    event?: string
  }>
  indicators?: string[]
  note?: string
  behavior?: string
  analysis?: string
  photoDescription?: string
  description?: string
  activity?: string
  narrative?: string
  week?: string
  academicYear?: string
}

export function parseAssessmentContent(assessment: PaudAssessment): PaudAssessmentContentParsed {
  if (!assessment.content) return {}
  if (typeof assessment.content === 'string') {
    try {
      return JSON.parse(assessment.content)
    } catch {
      return {}
    }
  }
  return assessment.content as PaudAssessmentContentParsed
}

async function loadAttachmentBuffer(
  userId: number,
  assessmentId: number,
  storedName: string
): Promise<Buffer | null> {
  const filePath = join(
    process.cwd(),
    'public',
    'uploads',
    'assessments',
    String(userId),
    String(assessmentId),
    storedName
  )
  if (existsSync(filePath)) {
    try {
      return await readFile(filePath)
    } catch {
      return null
    }
  }
  return null
}

// -----------------------------------------------------------------------------
// DOCX Sub-components: Exact PPM KBC Headers & Metadata
// -----------------------------------------------------------------------------

function renderAssessmentDocxHeader(
  user: User,
  assessment: PaudAssessment,
  instrumentTitle: string
): (Paragraph | Table)[] {
  const c = parseAssessmentContent(assessment)
  const className = assessment.schoolClass?.name
    ? `Kelompok ${assessment.schoolClass.name}`
    : 'B (5-6 Tahun)'
  const semesterStr = assessment.semester?.name
    ? assessment.semester.name.replace(/[^0-9]/g, '') || '1'
    : '1'
  const weekStr = c.week || '1'
  const semesterWeek = `${semesterStr} / ${weekStr}`
  const teacherName = user.fullName || 'Guru Kelas'
  const academicYear = c.academicYear || '2025/2026'

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 40 },
      children: [new TextRun({ text: 'ASESMEN RA', bold: true, size: 24, color: '111827' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: instrumentTitle,
          bold: true,
          size: 24,
          color: PAUD_DOCX_COLORS.BORDER_PURPLE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `TAHUN AJARAN : ${academicYear}`,
          bold: true,
          size: 20,
          color: PAUD_DOCX_COLORS.BORDER_PURPLE,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Jenjang / Kelas : ', bold: true, size: 20 }),
                    new TextRun({ text: className, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Semester / Minggu : ', bold: true, size: 20 }),
                    new TextRun({ text: semesterWeek, size: 20 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Guru Kelas : ', bold: true, size: 20 }),
                    new TextRun({ text: teacherName, size: 20 }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: NO_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: '', size: 20 })] })],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 40, after: 100 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 4, color: PAUD_DOCX_COLORS.BORDER_PURPLE },
      },
      text: '',
    }),
  ]
}

function renderAnecdotalDocx(assessments: PaudAssessment[], user: User): (Paragraph | Table)[] {
  const first = assessments[0]
  const elements: (Paragraph | Table)[] = []
  if (first) {
    elements.push(...renderAssessmentDocxHeader(user, first, 'CATATAN ANEKDOT'))
  }

  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Tanggal', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Nama Anak', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Kejadian Teramati', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 33, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Analisis Capaian', bold: true, size: 20 })],
          }),
        ],
      }),
    ],
  })

  const rows: TableRow[] = [headerRow]

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const observed = c.observedEvent || c.behavior || c.context || item.activity || '-'
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || '-'

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: dateStr, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: studentName, bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ children: [new TextRun({ text: observed, size: 19 })] })],
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [new Paragraph({ children: [new TextRun({ text: analysis, size: 19 })] })],
          }),
        ],
      })
    )
  }

  if (assessments.length === 0) {
    for (let i = 0; i < 3; i++) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 33, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
          ],
        })
      )
    }
  }

  elements.push(
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, rows })
  )
  return elements
}

function renderChecklistDocx(assessment: PaudAssessment, user: User): (Paragraph | Table)[] {
  const c = parseAssessmentContent(assessment)
  const studentName = assessment.student?.fullName || 'Nama Anak'

  const elements: (Paragraph | Table)[] = [
    ...renderAssessmentDocxHeader(
      user,
      assessment,
      'CEKLIS IKTP (INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN)'
    ),
  ]

  const headerRow1 = new TableRow({
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        rowSpan: 2,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'No', bold: true, size: 19 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 44, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        rowSpan: 2,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Indikator', bold: true, size: 19 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        columnSpan: 2,
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: studentName, bold: true, size: 19 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 26, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        rowSpan: 2,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Keterangan / Kejadian Teramati', bold: true, size: 19 }),
            ],
          }),
        ],
      }),
    ],
  })

  const headerRow2 = new TableRow({
    children: [
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Sudah Muncul', bold: true, size: 18 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Belum Muncul', bold: true, size: 18 })],
          }),
        ],
      }),
    ],
  })

  const rows: TableRow[] = [headerRow1, headerRow2]

  let items = c.items ?? []
  if (items.length === 0 && Array.isArray(c.indicators)) {
    items = c.indicators.map((ind, idx) => ({
      indicator: ind,
      status:
        idx === 0 || assessment.achievementStatus === 'berkembang_sesuai_harapan'
          ? 'sudah_muncul'
          : 'belum_muncul',
      observationNote: c.note || '',
    }))
  }

  if (items.length === 0) {
    items = [
      {
        indicator: 'Anak menunjukkan antusiasme dalam kegiatan eksplorasi dan interaksi',
        status: 'sudah_muncul',
        observationNote: 'Tampak senang dan aktif',
      },
      {
        indicator: 'Anak mampu mengikuti aturan bermain bersama kelompok secara mandiri',
        status: 'sudah_muncul',
        observationNote: 'Berbagi alat bermain',
      },
      {
        indicator: 'Anak mampu mengomunikasikan gagasan atau hasil karyanya dengan jelas',
        status: 'belum_muncul',
        observationNote: 'Perlu sedikit bimbingan guru',
      },
    ]
  }

  items.forEach((item, index) => {
    const isSudah = item.status === 'sudah_muncul'
    const isBelum = item.status === 'belum_muncul'

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 6, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: String(index + 1), size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 44, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [
              new Paragraph({ children: [new TextRun({ text: item.indicator, size: 19 })] }),
            ],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: isSudah ? '✔' : '',
                    font: 'Segoe UI Symbol',
                    bold: true,
                    size: 22,
                    color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: isBelum ? '✔' : '',
                    font: 'Segoe UI Symbol',
                    bold: true,
                    size: 22,
                    color: PAUD_DOCX_COLORS.DANGER_RED,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.observationNote || item.event || '-', size: 18 }),
                ],
              }),
            ],
          }),
        ],
      })
    )
  })

  elements.push(
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, rows })
  )
  return elements
}

async function renderWorkSampleDocx(
  assessments: PaudAssessment[],
  user: User
): Promise<(Paragraph | Table)[]> {
  const first = assessments[0]
  const elements: (Paragraph | Table)[] = []
  if (first) {
    elements.push(...renderAssessmentDocxHeader(user, first, 'DOKUMENTASI HASIL KARYA'))
  }

  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 13, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Tanggal', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Nama Anak', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 33, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Foto Karya Anak', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 36, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Deskripsi Foto dan Analisis Capaian Perkembangan',
                bold: true,
                size: 20,
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const rows: TableRow[] = [headerRow]

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const desc = c.workDescription || c.description || '-'
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || '-'

    const photoCells: Paragraph[] = []
    if (item.attachments && item.attachments.length > 0) {
      for (const att of item.attachments) {
        if (att.mimeType?.startsWith('image/')) {
          const imgBuf = await loadAttachmentBuffer(item.userId, item.id, att.storedName)
          if (imgBuf) {
            try {
              photoCells.push(
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: imgBuf,
                      transformation: { width: 140, height: 105 },
                    } as any),
                  ],
                })
              )
            } catch {
              photoCells.push(
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `[${att.originalName}]`, size: 18 })],
                })
              )
            }
          }
        }
      }
    }

    if (photoCells.length === 0) {
      photoCells.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: '[Foto Karya Anak]', italics: true, size: 18, color: '9CA3AF' }),
          ],
        })
      )
    }

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 13, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: dateStr, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: studentName, bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: photoCells,
          }),
          new TableCell({
            width: { size: 36, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Deskripsi Foto: ', bold: true, size: 18 }),
                  new TextRun({ text: desc, size: 18 }),
                ],
              }),
              new Paragraph({
                spacing: { before: 80 },
                children: [
                  new TextRun({ text: 'Analisis Capaian: ', bold: true, size: 18 }),
                  new TextRun({ text: analysis, size: 18 }),
                ],
              }),
            ],
          }),
        ],
      })
    )
  }

  if (assessments.length === 0) {
    for (let i = 0; i < 3; i++) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 13, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 18, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 33, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 36, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
          ],
        })
      )
    }
  }

  elements.push(
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, rows })
  )
  return elements
}

async function renderPhotoSeriesDocx(
  assessments: PaudAssessment[],
  user: User
): Promise<(Paragraph | Table)[]> {
  const first = assessments[0]
  const elements: (Paragraph | Table)[] = []
  if (first) {
    elements.push(...renderAssessmentDocxHeader(user, first, 'FOTO BERSERI'))
  }

  const headerRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 13, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Tanggal', bold: true, size: 20 })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Nama Anak, dan Dokumentasi Foto (Minimal 3)',
                bold: true,
                size: 20,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 42, type: WidthType.PERCENTAGE },
        shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
        verticalAlign: VerticalAlign.CENTER,
        borders: THIN_BORDER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Deskripsi Foto dan Analisis CP', bold: true, size: 20 }),
            ],
          }),
        ],
      }),
    ],
  })

  const rows: TableRow[] = [headerRow]

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const steps = c.stepDescriptions || (c.narrative ? [c.narrative] : [])
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || ''

    const photoCells: Paragraph[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: studentName, bold: true, size: 19 })],
      }),
    ]

    if (item.attachments && item.attachments.length > 0) {
      for (const att of item.attachments.slice(0, 3)) {
        if (att.mimeType?.startsWith('image/')) {
          const imgBuf = await loadAttachmentBuffer(item.userId, item.id, att.storedName)
          if (imgBuf) {
            try {
              photoCells.push(
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60 },
                  children: [
                    new ImageRun({
                      data: imgBuf,
                      transformation: { width: 130, height: 95 },
                    } as any),
                  ],
                })
              )
            } catch {}
          }
        }
      }
    }

    if (photoCells.length === 1) {
      photoCells.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60 },
          children: [
            new TextRun({
              text: '[Foto Seri: Tahap 1, 2, 3]',
              italics: true,
              size: 18,
              color: '9CA3AF',
            }),
          ],
        })
      )
    }

    const narrativeCells: Paragraph[] = []
    steps.forEach((step, sIdx) => {
      if (step) {
        narrativeCells.push(
          new Paragraph({
            spacing: { before: 40 },
            children: [
              new TextRun({ text: `Tahap ${sIdx + 1}: `, bold: true, size: 18 }),
              new TextRun({ text: step, size: 18 }),
            ],
          })
        )
      }
    })
    if (analysis) {
      narrativeCells.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: 'Analisis CP: ', bold: true, size: 18 }),
            new TextRun({ text: analysis, size: 18 }),
          ],
        })
      )
    }

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 13, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: dateStr, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: THIN_BORDER,
            children: photoCells,
          }),
          new TableCell({
            width: { size: 42, type: WidthType.PERCENTAGE },
            borders: THIN_BORDER,
            children: narrativeCells,
          }),
        ],
      })
    )
  }

  if (assessments.length === 0) {
    for (let i = 0; i < 3; i++) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 13, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
            new TableCell({
              width: { size: 42, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph('')],
            }),
          ],
        })
      )
    }
  }

  elements.push(
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: THIN_BORDER, rows })
  )
  elements.push(
    new Paragraph({
      spacing: { before: 100, after: 120 },
      children: [
        new TextRun({
          text: 'Catatan: Foto berseri fokus pada proses perkembangan pada satu keterampilan/kegiatan yang sama dari waktu ke waktu; Menunjukkan progres bertahap dalam penguasaan suatu keterampilan;',
          italics: true,
          size: 17,
          color: '6B7280',
        }),
      ],
    })
  )
  return elements
}

/**
 * Builds Full Cover & RPM KBC RA Learning Plan Document according to PPM KBC PM Kelas B standard
 */
function renderPpmKbcPlanSections(
  user: User,
  assessment: PaudAssessment,
  themeTitle = 'Kenalkan'
): (Paragraph | Table)[] {
  const content = parseAssessmentContent(assessment)
  const kop = (user.kopSurat as Record<string, any>) ?? {}
  const schoolName = kop.namaSekolah || user.fullName || 'RA / TK PAUD'
  const className = assessment.schoolClass?.name
    ? `Kelompok ${assessment.schoolClass.name}`
    : 'B (5-6 Tahun)'
  const semesterLabel = assessment.semester?.name || '1 (Gasal)'
  const teacherName = user.fullName || 'Guru Pembimbing'
  const mainTheme = themeTitle || content.theme || 'DIRIKU'

  const elements: (Paragraph | Table)[] = [
    // ---------------- Cover Page ----------------
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 80 },
      children: [new TextRun({ text: 'AKU HAMBA ALLAH :', bold: true, size: 28, color: '111827' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `AYO KITA BERKENALAN (${mainTheme.toUpperCase()})`,
          bold: true,
          size: 28,
          color: PAUD_DOCX_COLORS.BORDER_PURPLE,
        }),
      ],
    }),

    // Box Table RPM KBC RA FASE FONDASI
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: THIN_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80, after: 80 },
                  children: [
                    new TextRun({ text: 'RPM KBC RA   FASE FONDASI', bold: true, size: 24 }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'PENULIS', bold: true, size: 20 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: ':', size: 20 })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: teacherName, size: 20 })] }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'TOPIK', bold: true, size: 20 })] }),
              ],
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: ':', size: 20 })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: mainTheme.toUpperCase(), size: 20 })],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'SUB TOPIK', bold: true, size: 20 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 5, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: ':', size: 20 })] })],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'IDENTITAS DIRI & LINGKUNGAN', size: 20 })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ pageBreakBefore: true, text: '' }),

    // ---------------- Page 2: PERENCANAAN PEMBELAJARAN MENDALAM KBC RA ----------------
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 140 },
      children: [
        new TextRun({
          text: 'PERENCANAAN PEMBELAJARAN MENDALAM KBC RA',
          bold: true,
          size: 24,
          color: PAUD_DOCX_COLORS.BORDER_PURPLE,
        }),
      ],
    }),

    // Table Perencanaan Metadata
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: THIN_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Penulis', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: teacherName, size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Semester', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: semesterLabel, size: 19 })] }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Asal Sekolah', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: schoolName, size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Minggu Ke-', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: '1', size: 19 })] })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Fase', bold: true, size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: 'Fondasi', size: 19 })] })],
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Bulan', bold: true, size: 19 })] }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Juli / Agustus', size: 19 })] }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Jenjang/Kelas', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [new Paragraph({ children: [new TextRun({ text: className, size: 19 })] })],
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Alokasi Waktu', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: '5 x 3 JP (900 Menit)', size: 19 })],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Model Pembelajaran', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Kolaboratif, STEAM, Loose Parts', size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Jumlah Anak', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 28, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({ children: [new TextRun({ text: '15-20 Anak', size: 19 })] }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Topik / Sub Topik', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 3,
              width: { size: 78, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${mainTheme} / Identitas Diri (Aku Istimewa: Ayo Kita Berkenalan)`,
                      bold: true,
                      size: 19,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Section 1: IDENTIFIKASI
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [new TextRun({ text: 'IDENTIFIKASI', bold: true, size: 22, color: '111827' })],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: THIN_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Peserta Didik', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Anak kelompok B (5-6 tahun) memiliki kemampuan dasar mengenal identitas diri namun masih memerlukan bimbingan untuk mengekspresikan secara verbal dan menunjukkan kepercayaan diri. Mereka memiliki rasa ingin tahu tinggi tentang diri sendiri dan teman-temannya, serta senang berinteraksi sosial dalam kegiatan bermain kelompok.',
                      size: 19,
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Materi Pelajaran', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Materi identitas diri mencakup pengetahuan esensial tentang nama lengkap, anggota keluarga, ciri fisik, rasa syukur atas keunikan diri ciptaan Allah SWT, menghargai perbedaan, dan kemandirian.',
                      size: 19,
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Dimensi Profil Lulusan', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '✔ ',
                      font: 'Segoe UI Symbol',
                      bold: true,
                      color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                    }),
                    new TextRun({ text: 'DPL1 Keimanan & Ketakwaan   ', size: 18 }),
                    new TextRun({
                      text: '✔ ',
                      font: 'Segoe UI Symbol',
                      bold: true,
                      color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                    }),
                    new TextRun({ text: 'DPL2 Kewargaan   ', size: 18 }),
                    new TextRun({
                      text: '✔ ',
                      font: 'Segoe UI Symbol',
                      bold: true,
                      color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                    }),
                    new TextRun({ text: 'DPL5 Kolaborasi   ', size: 18 }),
                    new TextRun({
                      text: '✔ ',
                      font: 'Segoe UI Symbol',
                      bold: true,
                      color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                    }),
                    new TextRun({ text: 'DPL6 Kemandirian   ', size: 18 }),
                    new TextRun({
                      text: '✔ ',
                      font: 'Segoe UI Symbol',
                      bold: true,
                      color: PAUD_DOCX_COLORS.SUCCESS_GREEN,
                    }),
                    new TextRun({ text: 'DPL8 Komunikasi', size: 18 }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Section 2: DESAIN PEMBELAJARAN
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({ text: 'DESAIN PEMBELAJARAN', bold: true, size: 22, color: '111827' }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: THIN_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Capaian Pembelajaran', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'CP Nilai Agama dan Budi Pekerti, CP Jati Diri (Murid mengenali identitas diri, karakteristik fisik, agama, dan peran sosial), serta CP Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM).',
                      size: 19,
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Tujuan Pembelajaran', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '1. Anak mampu mengenal dan bersyukur atas identitas dirinya sebagai ciptaan Allah SWT.\n2. Anak mampu berinteraksi positif, menyapa, dan bekerja sama dengan teman dan guru.\n3. Anak mampu mengekspresikan gagasan dan kreativitas melalui karya seni dan bermain peran.',
                      size: 19,
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: PAUD_DOCX_COLORS.HEADER_FILL_PINK },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Praktik Pedagogis', bold: true, size: 19 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 75, type: WidthType.PERCENTAGE },
              borders: THIN_BORDER,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Pendekatan bermain bermakna, bercerita interaktif, bernyanyi riang, eksplorasi media loose parts, dan pembiasaan adab Islami sehari-hari.',
                      size: 19,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Section 3: ASESMEN PEMBELAJARAN
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({ text: 'ASESMEN PEMBELAJARAN', bold: true, size: 22, color: '111827' }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Asesmen dirancang autentik berbasis bukti pengamatan berkala meliputi: Asesmen Awal (Observasi pengenalan diri), Asesmen Formatif/Proses (Catatan Anekdot, Ceklis IKTP, Dokumentasi Hasil Karya, dan Foto Berseri), serta Asesmen Akhir (Refleksi & Unjuk Kerja).',
          size: 19,
        }),
      ],
    }),

    new Paragraph({ pageBreakBefore: true, text: '' }),
  ]

  return elements
}

export async function buildPaudAssessmentDocx(
  assessment: PaudAssessment,
  user: User
): Promise<Buffer> {
  const children: (Paragraph | Table)[] = []

  if (assessment.type === 'anecdotal_note') {
    children.push(...renderAnecdotalDocx([assessment], user))
  } else if (assessment.type === 'checklist') {
    children.push(...renderChecklistDocx(assessment, user))
  } else if (assessment.type === 'work_sample') {
    children.push(...(await renderWorkSampleDocx([assessment], user)))
  } else if (assessment.type === 'photo_series') {
    children.push(...(await renderPhotoSeriesDocx([assessment], user)))
  }

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
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBuffer(doc)
}

export async function buildPaudAssessmentBundleDocx(
  assessments: PaudAssessment[],
  user: User,
  themeTitle = 'Kenalkan'
): Promise<Buffer> {
  const first = assessments[0]
  const children: (Paragraph | Table)[] = []

  // 1. Cover & Full RPM KBC RA Learning Plan
  if (first) {
    children.push(...renderPpmKbcPlanSections(user, first, themeTitle))
  }

  const anecdotes = assessments.filter((a) => a.type === 'anecdotal_note')
  const checklists = assessments.filter((a) => a.type === 'checklist')
  const workSamples = assessments.filter((a) => a.type === 'work_sample')
  const photoSeries = assessments.filter((a) => a.type === 'photo_series')

  // Catatan Anekdot
  if (first) {
    children.push(
      ...renderAnecdotalDocx(anecdotes, user),
      new Paragraph({ pageBreakBefore: true, text: '' })
    )
  }

  // Ceklis IKTP
  if (checklists.length > 0) {
    checklists.forEach((chk, i) => {
      children.push(...renderChecklistDocx(chk, user))
      if (i < checklists.length - 1) {
        children.push(new Paragraph({ spacing: { before: 200, after: 100 }, text: '' }))
      }
    })
  } else if (first) {
    children.push(...renderChecklistDocx(first, user))
  }
  children.push(new Paragraph({ pageBreakBefore: true, text: '' }))

  // Hasil Karya
  if (first) {
    children.push(
      ...(await renderWorkSampleDocx(workSamples, user)),
      new Paragraph({ pageBreakBefore: true, text: '' })
    )
  }

  // Foto Berseri
  if (first) {
    children.push(...(await renderPhotoSeriesDocx(photoSeries, user)))
  }

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
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBuffer(doc)
}

// -----------------------------------------------------------------------------
// PDF Vector Checkmark Helper
// -----------------------------------------------------------------------------
function drawVectorCheckmark(
  doc: PDFKit.PDFDocument,
  centerX: number,
  centerY: number,
  color = PAUD_PDF_COLORS.SUCCESS_GREEN
) {
  doc.save()
  doc.lineWidth(1.8).strokeColor(color).lineCap('round').lineJoin('round')
  doc
    .moveTo(centerX - 4.5, centerY)
    .lineTo(centerX - 1.2, centerY + 3.8)
    .lineTo(centerX + 5.5, centerY - 4.2)
    .stroke()
  doc.restore()
}

// -----------------------------------------------------------------------------
// PDF Sub-components: Exact PPM KBC Headers & Metadata
// -----------------------------------------------------------------------------

function drawAssessmentPdfHeader(
  doc: PDFKit.PDFDocument,
  user: User,
  assessment: PaudAssessment,
  instrumentTitle: string
) {
  const c = parseAssessmentContent(assessment)
  const className = assessment.schoolClass?.name
    ? `Kelompok ${assessment.schoolClass.name}`
    : 'B (5-6 Tahun)'
  const semesterStr = assessment.semester?.name
    ? assessment.semester.name.replace(/[^0-9]/g, '') || '1'
    : '1'
  const weekStr = c.week || '1'
  const semesterWeek = `${semesterStr} / ${weekStr}`
  const teacherName = user.fullName || 'Guru Kelas'
  const academicYear = c.academicYear || '2025/2026'

  const leftX = 40
  const tableWidth = 532

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#111827')
    .text('ASESMEN RA', { align: 'center' })
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .text(instrumentTitle, { align: 'center' })
  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .text(`TAHUN AJARAN : ${academicYear}`, { align: 'center' })
  doc.moveDown(0.4)

  const metaY = doc.y
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
  doc.text('Jenjang / Kelas  :', leftX, metaY, { width: 95 })
  doc.font('Helvetica').text(className, leftX + 100, metaY, { width: 180 })

  doc.font('Helvetica-Bold').text('Semester / Minggu  :', leftX + 290, metaY, { width: 110 })
  doc.font('Helvetica').text(semesterWeek, leftX + 405, metaY, { width: 120 })

  const row2Y = metaY + 13
  doc.font('Helvetica-Bold').text('Guru Kelas          :', leftX, row2Y, { width: 95 })
  doc.font('Helvetica').text(teacherName, leftX + 100, row2Y, { width: 180 })

  // Subtle Purple Divider Line
  doc
    .moveTo(leftX, row2Y + 16)
    .lineTo(leftX + tableWidth, row2Y + 16)
    .lineWidth(0.6)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  doc.y = row2Y + 22
}

export function drawAnecdotalPdf(
  doc: PDFKit.PDFDocument,
  assessments: PaudAssessment[],
  user: User
) {
  const first = assessments[0]
  if (doc.y > 640) doc.addPage()

  if (first) {
    drawAssessmentPdfHeader(doc, user, first, 'CATATAN ANEKDOT')
  }

  const leftX = 40
  const tableWidth = 532
  const colW = [70, 95, 175, 192]

  let tableY = doc.y

  doc.fillColor(PAUD_PDF_COLORS.HEADER_FILL_PINK).rect(leftX, tableY, tableWidth, 22).fill()
  doc
    .rect(leftX, tableY, tableWidth, 22)
    .lineWidth(0.8)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  let curX = leftX
  const headers = ['Tanggal', 'Nama Anak', 'Kejadian Teramati', 'Analisis Capaian']
  headers.forEach((h, idx) => {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(h, curX + 2, tableY + 6, { width: colW[idx] - 4, align: 'center' })
    if (idx > 0) {
      doc
        .moveTo(curX, tableY)
        .lineTo(curX, tableY + 22)
        .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
        .stroke()
    }
    curX += colW[idx]
  })

  tableY += 22

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const observed = c.observedEvent || c.behavior || c.context || item.activity || '-'
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || '-'

    doc.fontSize(8)
    const textObsHeight = doc.heightOfString(observed, { width: colW[2] - 8 })
    const textAnalysisHeight = doc.heightOfString(analysis, { width: colW[3] - 8 })
    const rowHeight = Math.max(textObsHeight + 10, textAnalysisHeight + 10, 24)

    if (tableY + rowHeight > 750) {
      doc.addPage()
      tableY = 40
    }

    doc
      .rect(leftX, tableY, tableWidth, rowHeight)
      .lineWidth(0.5)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    let cellX = leftX
    doc.font('Helvetica').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(dateStr, cellX + 3, tableY + 5, { width: colW[0] - 6, align: 'center' })
    cellX += colW[0]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text(studentName, cellX + 3, tableY + 5, { width: colW[1] - 6, align: 'center' })
    cellX += colW[1]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(observed, cellX + 4, tableY + 5, { width: colW[2] - 8 })
    cellX += colW[2]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(analysis, cellX + 4, tableY + 5, { width: colW[3] - 8 })

    tableY += rowHeight
  }

  doc.y = tableY + 16
}

export function drawChecklistPdf(doc: PDFKit.PDFDocument, assessment: PaudAssessment, user: User) {
  const leftX = 40
  const tableWidth = 532
  const colW = [28, 234, 65, 65, 140]

  if (doc.y > 640) doc.addPage()

  drawAssessmentPdfHeader(
    doc,
    user,
    assessment,
    'CEKLIS IKTP (INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN)'
  )

  const c = parseAssessmentContent(assessment)
  const studentName = assessment.student?.fullName || 'Nama Anak'

  let tableY = doc.y

  doc.fillColor(PAUD_PDF_COLORS.HEADER_FILL_PINK).rect(leftX, tableY, tableWidth, 30).fill()
  doc
    .rect(leftX, tableY, tableWidth, 30)
    .lineWidth(0.8)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
  doc.text('No', leftX + 2, tableY + 10, { width: colW[0] - 4, align: 'center' })
  doc
    .moveTo(leftX + colW[0], tableY)
    .lineTo(leftX + colW[0], tableY + 30)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  doc.text('Indikator', leftX + colW[0] + 4, tableY + 10, { width: colW[1] - 8, align: 'center' })
  const xSpan = leftX + colW[0] + colW[1]
  doc
    .moveTo(xSpan, tableY)
    .lineTo(xSpan, tableY + 30)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  doc.text(studentName, xSpan + 2, tableY + 3, { width: colW[2] + colW[3] - 4, align: 'center' })
  doc
    .moveTo(xSpan, tableY + 15)
    .lineTo(xSpan + colW[2] + colW[3], tableY + 15)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  doc.fontSize(7.5)
  doc.text('Sudah Muncul', xSpan + 2, tableY + 18, { width: colW[2] - 4, align: 'center' })
  doc
    .moveTo(xSpan + colW[2], tableY + 15)
    .lineTo(xSpan + colW[2], tableY + 30)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()
  doc.text('Belum Muncul', xSpan + colW[2] + 2, tableY + 18, {
    width: colW[3] - 4,
    align: 'center',
  })

  const xKet = xSpan + colW[2] + colW[3]
  doc
    .moveTo(xKet, tableY)
    .lineTo(xKet, tableY + 30)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()
  doc.fontSize(8.5).text('Keterangan / Kejadian Teramati', xKet + 3, tableY + 6, {
    width: colW[4] - 6,
    align: 'center',
  })

  tableY += 30

  let items = c.items ?? []
  if (items.length === 0 && Array.isArray(c.indicators)) {
    items = c.indicators.map((ind) => ({
      indicator: ind,
      status: 'sudah_muncul',
      observationNote: c.note || '',
    }))
  }

  if (items.length === 0) {
    items = [
      {
        indicator: 'Anak menunjukkan ekspresi senang saat bermain bersama teman',
        status: 'sudah_muncul',
        observationNote: 'Tersenyum dan antusias',
      },
      {
        indicator: 'Anak mampu menyelesaikan tugas sederhana secara mandiri',
        status: 'sudah_muncul',
        observationNote: 'Mandiri dan teliti',
      },
      {
        indicator: 'Anak dapat menceritakan pengalaman belajarnya hari ini',
        status: 'belum_muncul',
        observationNote: 'Didampingi guru',
      },
    ]
  }

  items.forEach((item, index) => {
    const isSudah = item.status === 'sudah_muncul'
    const isBelum = item.status === 'belum_muncul'

    doc.fontSize(8)
    const textIndHeight = doc.heightOfString(item.indicator, { width: colW[1] - 8 })
    const textObsHeight = doc.heightOfString(item.observationNote || item.event || '-', {
      width: colW[4] - 8,
    })
    const rowHeight = Math.max(textIndHeight + 10, textObsHeight + 10, 24)

    if (tableY + rowHeight > 750) {
      doc.addPage()
      tableY = 40
    }

    doc
      .rect(leftX, tableY, tableWidth, rowHeight)
      .lineWidth(0.5)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    let cellX = leftX
    doc.font('Helvetica').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(String(index + 1), cellX + 2, tableY + 5, { width: colW[0] - 4, align: 'center' })
    cellX += colW[0]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(item.indicator, cellX + 4, tableY + 5, { width: colW[1] - 8 })
    cellX += colW[1]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    // Draw Vector Checkmark under Sudah Muncul
    if (isSudah) {
      drawVectorCheckmark(
        doc,
        cellX + colW[2] / 2,
        tableY + rowHeight / 2,
        PAUD_PDF_COLORS.SUCCESS_GREEN
      )
    }
    cellX += colW[2]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    // Draw Vector Checkmark under Belum Muncul
    if (isBelum) {
      drawVectorCheckmark(
        doc,
        cellX + colW[3] / 2,
        tableY + rowHeight / 2,
        PAUD_PDF_COLORS.DANGER_RED
      )
    }
    cellX += colW[3]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc.font('Helvetica').fontSize(8).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(item.observationNote || item.event || '-', cellX + 4, tableY + 5, {
      width: colW[4] - 8,
    })

    tableY += rowHeight
  })

  doc.y = tableY + 16
}

export function drawWorkSamplePdf(
  doc: PDFKit.PDFDocument,
  assessments: PaudAssessment[],
  user: User
) {
  const first = assessments[0]
  if (doc.y > 640) doc.addPage()

  if (first) {
    drawAssessmentPdfHeader(doc, user, first, 'DOKUMENTASI HASIL KARYA')
  }

  const leftX = 40
  const tableWidth = 532
  const colW = [68, 95, 175, 194]

  let tableY = doc.y

  doc.fillColor(PAUD_PDF_COLORS.HEADER_FILL_PINK).rect(leftX, tableY, tableWidth, 22).fill()
  doc
    .rect(leftX, tableY, tableWidth, 22)
    .lineWidth(0.8)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  let curX = leftX
  const headers = [
    'Tanggal',
    'Nama Anak',
    'Foto Karya Anak',
    'Deskripsi Foto dan Analisis Capaian Perkembangan',
  ]
  headers.forEach((h, idx) => {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(h, curX + 2, tableY + 5, { width: colW[idx] - 4, align: 'center' })
    if (idx > 0) {
      doc
        .moveTo(curX, tableY)
        .lineTo(curX, tableY + 22)
        .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
        .stroke()
    }
    curX += colW[idx]
  })

  tableY += 22

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const desc = c.workDescription || c.description || '-'
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || '-'

    const rowHeight = 115
    if (tableY + rowHeight > 750) {
      doc.addPage()
      tableY = 40
    }

    doc
      .rect(leftX, tableY, tableWidth, rowHeight)
      .lineWidth(0.5)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    let cellX = leftX
    doc.font('Helvetica').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(dateStr, cellX + 3, tableY + 45, { width: colW[0] - 6, align: 'center' })
    cellX += colW[0]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text(studentName, cellX + 3, tableY + 45, { width: colW[1] - 6, align: 'center' })
    cellX += colW[1]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    // Embed Attachment Photo if available
    let hasDrawnPhoto = false
    if (item.attachments && item.attachments.length > 0) {
      for (const att of item.attachments) {
        if (att.mimeType?.startsWith('image/')) {
          const filePath = join(
            process.cwd(),
            'public',
            'uploads',
            'assessments',
            String(item.userId),
            String(item.id),
            att.storedName
          )
          if (existsSync(filePath)) {
            try {
              doc.image(filePath, cellX + 15, tableY + 8, {
                width: 145,
                height: 98,
                fit: [145, 98],
              })
              hasDrawnPhoto = true
              break
            } catch {}
          }
        }
      }
    }

    if (!hasDrawnPhoto) {
      doc
        .rect(cellX + 15, tableY + 8, 145, 98)
        .lineWidth(0.5)
        .dash(3, { space: 2 })
        .strokeColor('#CBD5E1')
        .stroke()
        .undash()
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#94A3B8')
        .text('[ Foto Karya Anak ]', cellX + 15, tableY + 48, { width: 145, align: 'center' })
    }

    cellX += colW[2]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc.font('Helvetica-Bold').fontSize(8).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text('Deskripsi Foto: ', cellX + 4, tableY + 6, { width: colW[3] - 8 })
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .text(desc, cellX + 4, doc.y + 2, { width: colW[3] - 8 })

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text('Analisis Capaian: ', cellX + 4, doc.y + 6, { width: colW[3] - 8 })
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .text(analysis, cellX + 4, doc.y + 2, { width: colW[3] - 8 })

    tableY += rowHeight
  }

  doc.y = tableY + 16
}

export function drawPhotoSeriesPdf(
  doc: PDFKit.PDFDocument,
  assessments: PaudAssessment[],
  user: User
) {
  const first = assessments[0]
  if (doc.y > 640) doc.addPage()

  if (first) {
    drawAssessmentPdfHeader(doc, user, first, 'FOTO BERSERI')
  }

  const leftX = 40
  const tableWidth = 532
  const colW = [68, 232, 232]

  let tableY = doc.y

  doc.fillColor(PAUD_PDF_COLORS.HEADER_FILL_PINK).rect(leftX, tableY, tableWidth, 22).fill()
  doc
    .rect(leftX, tableY, tableWidth, 22)
    .lineWidth(0.8)
    .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .stroke()

  let curX = leftX
  const headers = [
    'Tanggal',
    'Nama Anak, dan Dokumentasi Foto (Minimal 3)',
    'Deskripsi Foto dan Analisis CP',
  ]
  headers.forEach((h, idx) => {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(h, curX + 2, tableY + 5, { width: colW[idx] - 4, align: 'center' })
    if (idx > 0) {
      doc
        .moveTo(curX, tableY)
        .lineTo(curX, tableY + 22)
        .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
        .stroke()
    }
    curX += colW[idx]
  })

  tableY += 22

  for (const item of assessments) {
    const c = parseAssessmentContent(item)
    const studentName = item.student?.fullName || '-'
    const dateStr = item.date ? item.date.toFormat('dd/MM/yyyy') : '-'
    const steps = c.stepDescriptions || (c.narrative ? [c.narrative] : [])
    const analysis = c.achievementAnalysis || c.analysis || item.teacherNote || ''

    const rowHeight = 120
    if (tableY + rowHeight > 750) {
      doc.addPage()
      tableY = 40
    }

    doc
      .rect(leftX, tableY, tableWidth, rowHeight)
      .lineWidth(0.5)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    let cellX = leftX
    doc.font('Helvetica').fontSize(8.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
    doc.text(dateStr, cellX + 3, tableY + 50, { width: colW[0] - 6, align: 'center' })
    cellX += colW[0]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .text(studentName, cellX + 4, tableY + 5, { width: colW[1] - 8, align: 'center' })

    // Draw 3 thumbnail boxes
    const thumbW = 68
    const thumbH = 80
    const thumbY = tableY + 22
    let curThumbX = cellX + 8

    let drawnCount = 0
    if (item.attachments && item.attachments.length > 0) {
      for (const att of item.attachments.slice(0, 3)) {
        if (att.mimeType?.startsWith('image/')) {
          const filePath = join(
            process.cwd(),
            'public',
            'uploads',
            'assessments',
            String(item.userId),
            String(item.id),
            att.storedName
          )
          if (existsSync(filePath)) {
            try {
              doc.image(filePath, curThumbX, thumbY, {
                width: thumbW,
                height: thumbH,
                fit: [thumbW, thumbH],
              })
              drawnCount++
              curThumbX += thumbW + 6
            } catch {}
          }
        }
      }
    }

    while (drawnCount < 3) {
      doc
        .rect(curThumbX, thumbY, thumbW, thumbH)
        .lineWidth(0.5)
        .dash(3, { space: 2 })
        .strokeColor('#CBD5E1')
        .stroke()
        .undash()
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#94A3B8')
        .text(`Tahap ${drawnCount + 1}`, curThumbX, thumbY + 34, { width: thumbW, align: 'center' })
      drawnCount++
      curThumbX += thumbW + 6
    }

    cellX += colW[1]
    doc
      .moveTo(cellX, tableY)
      .lineTo(cellX, tableY + rowHeight)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()

    let textY = tableY + 6
    steps.forEach((st, sIdx) => {
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor(PAUD_PDF_COLORS.TEXT_DARK)
      doc.text(`Tahap ${sIdx + 1}: `, cellX + 4, textY, { width: colW[2] - 8, continued: true })
      doc.font('Helvetica').text(st, { width: colW[2] - 8 })
      textY = doc.y + 3
    })

    if (analysis) {
      doc
        .font('Helvetica-Bold')
        .fontSize(7.5)
        .text('Analisis CP: ', cellX + 4, textY, { width: colW[2] - 8, continued: true })
      doc.font('Helvetica').text(analysis, { width: colW[2] - 8 })
    }

    tableY += rowHeight
  }

  doc.y = tableY + 8
  doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(PAUD_PDF_COLORS.TEXT_MUTED)
  doc.text(
    'Catatan: Foto berseri fokus pada proses perkembangan pada satu keterampilan/kegiatan yang sama dari waktu ke waktu; Menunjukkan progres bertahap dalam penguasaan suatu keterampilan;',
    leftX,
    doc.y,
    { width: tableWidth }
  )
  doc.y += 16
}

export async function buildPaudAssessmentPdf(
  assessment: PaudAssessment,
  user: User
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 40, size: 'A4' })

  if (assessment.type === 'anecdotal_note') {
    drawAnecdotalPdf(doc, [assessment], user)
  } else if (assessment.type === 'checklist') {
    drawChecklistPdf(doc, assessment, user)
  } else if (assessment.type === 'work_sample') {
    drawWorkSamplePdf(doc, [assessment], user)
  } else if (assessment.type === 'photo_series') {
    drawPhotoSeriesPdf(doc, [assessment], user)
  }

  return streamToBuffer(doc)
}

export async function buildPaudAssessmentBundlePdf(
  assessments: PaudAssessment[],
  user: User,
  themeTitle = 'Kenalkan'
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 40, size: 'A4' })
  const first = assessments[0]

  // Cover Page in PDF
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#111827')
    .text('AKU HAMBA ALLAH :', { align: 'center' })
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor(PAUD_PDF_COLORS.BORDER_PURPLE)
    .text(`AYO KITA BERKENALAN (${themeTitle.toUpperCase()})`, { align: 'center' })
  doc.moveDown(1.5)

  const leftX = 60
  const boxW = 472
  doc.fillColor(PAUD_PDF_COLORS.HEADER_FILL_PINK).rect(leftX, doc.y, boxW, 28).fill()
  doc.rect(leftX, doc.y, boxW, 28).lineWidth(1).strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE).stroke()
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#111827')
    .text('RPM KBC RA   FASE FONDASI', leftX, doc.y + 8, { width: boxW, align: 'center' })

  let boxY = doc.y + 20
  const rowsMeta = [
    ['PENULIS', user.fullName || 'Guru Kelas'],
    ['TOPIK', themeTitle.toUpperCase()],
    ['SUB TOPIK', 'IDENTITAS DIRI & LINGKUNGAN'],
  ]
  rowsMeta.forEach(([lbl, val]) => {
    doc
      .rect(leftX, boxY, boxW, 24)
      .lineWidth(0.6)
      .strokeColor(PAUD_PDF_COLORS.BORDER_PURPLE)
      .stroke()
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor('#111827')
      .text(lbl, leftX + 10, boxY + 7, { width: 100 })
    doc.text(':', leftX + 115, boxY + 7)
    doc
      .font('Helvetica')
      .fontSize(9)
      .text(val, leftX + 130, boxY + 7, { width: 320 })
    boxY += 24
  })

  // Page 2: 4 Instruments
  doc.addPage()

  const anecdotes = assessments.filter((a) => a.type === 'anecdotal_note')
  const checklists = assessments.filter((a) => a.type === 'checklist')
  const workSamples = assessments.filter((a) => a.type === 'work_sample')
  const photoSeries = assessments.filter((a) => a.type === 'photo_series')

  drawAnecdotalPdf(doc, anecdotes, user)

  if (checklists.length > 0) {
    checklists.forEach((chk) => drawChecklistPdf(doc, chk, user))
  } else if (first) {
    drawChecklistPdf(doc, first, user)
  }

  drawWorkSamplePdf(doc, workSamples, user)
  drawPhotoSeriesPdf(doc, photoSeries, user)

  return streamToBuffer(doc)
}

function streamToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.end()
  })
}
