import { test } from '@japa/runner'
import { Packer } from 'docx'
import { EXAM_WORKSHEET_PAGE, renderExamWorksheetHtml } from '#services/exam_worksheet_service'
import { createExamDocument } from '#services/export_service'

const png = 'data:image/png;base64,iVBORw0KGgo='

test.group('RA/TK exam worksheet renderer', () => {
  test('renders the canonical custom paper contract and every supported activity', ({ assert }) => {
    const html = renderExamWorksheetHtml(
      {
        title: 'Evaluasi Semester <2>',
        header: {
          institutionName: 'RA Contoh',
          institutionSubName: 'AZZUMAR',
          addressLine1: 'Jl. Pendidikan',
          groupName: 'Kelompok B',
          subject: 'Tema Tanaman',
          logoUrl: png,
        },
        questions: [
          {
            type: 'multiple_choice',
            question: 'Pilih gambar yang benar',
            options: [{ label: 'A', text: 'Bunga', imageUrl: png }],
          },
          {
            type: 'matching',
            question: 'Hubungkan pasangan yang sesuai',
            leftItems: [{ label: 'Hujan' }],
            rightItems: [{ label: 'Payung' }],
          },
          { type: 'tracing', question: 'Tebalkan kata', traceText: 'Allah' },
          { type: 'coloring', question: 'Warnai buah', assetStatus: 'quota_unavailable' },
          {
            type: 'visual',
            visualType: 'line-art coloring',
            question: 'Warnai gambar bunga',
          },
          { type: 'fill_blank_image', question: 'Tulis nama gambar', imagePrompt: 'buah' },
          {
            type: 'count_and_circle',
            question: 'Hitung dan lingkari',
            countItems: [{ count: 4, options: [3, 4, 5] }],
          },
          {
            type: 'vertical_math',
            question: 'Hitung ke bawah',
            mathProblems: [{ topNumber: 2, operator: '+', bottomNumber: 1 }],
          },
          { type: 'essay', question: 'Ceritakan kegiatanmu' },
          { type: 'practical', question: 'Amati kegiatan anak' },
        ],
      } as any,
      { schoolName: 'RA Contoh', kopSurat: {} } as any
    )

    assert.include(
      html,
      `@page{size:${EXAM_WORKSHEET_PAGE.widthInches}in ${EXAM_WORKSHEET_PAGE.heightInches}in;margin:0}`
    )
    assert.include(html, '8.51in')
    assert.include(html, '14.34in')
    assert.include(html, 'Hubungkan Garis')
    assert.include(html, 'Warnai Sesuai Petunjuk')
    assert.include(html, 'trace-text')
    assert.include(html, 'Gambar belum tersedia')
    assert.include(html, 'Ilustrasi tidak dibuat karena kuota generate gambar habis.')
    assert.include(html, 'count-grid')
    assert.include(html, 'math-grid')
    assert.include(html, 'teacher-observation')
    assert.include(html, 'data:image/png;base64')
    assert.include(html, 'Evaluasi Semester &lt;2&gt;')
    assert.notInclude(html, 'line-art coloring')
  })

  test('serializes the primary DOCX as a worksheet without an appended answer-key page', async ({
    assert,
  }) => {
    const buffer = await Packer.toBuffer(
      createExamDocument(
        {
          title: 'Lembar Soal',
          header: { institutionName: 'RA Contoh' },
          questions: [{ type: 'essay', question: 'Ceritakan kegiatanmu' }],
        } as any,
        { schoolName: 'RA Contoh', kopSurat: {} } as any
      )
    )

    assert.equal(buffer.subarray(0, 2).toString(), 'PK')
    assert.include(buffer.toString('latin1'), 'word/document.xml')
  })
})
