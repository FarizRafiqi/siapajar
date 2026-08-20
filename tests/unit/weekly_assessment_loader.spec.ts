import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { loadWeeklyPlanAssessments } from '#services/weekly_assessment_loader'

test.group('Weekly Assessment Loader', () => {
  test('returns empty checklists and anecdotes when no DB assessments or AI data exist', async ({
    assert,
  }) => {
    // @ts-ignore
    const result = await loadWeeklyPlanAssessments({ userId: 0, classId: 0, weekStartDate: null })
    assert.equal(result.anecdotes.length, 0)
    assert.equal(result.studentChecklists.length, 0)
    assert.equal(result.workSamples.length, 0)
    assert.equal(result.photoSeries.length, 0)
    assert.equal(result.totalCount, 0)
  })

  test('loads AI-generated student checklists and anecdotes correctly from RPM content', async ({
    assert,
  }) => {
    const customContent = {
      assessment: {
        anecdotes: [
          {
            studentName: 'Siswa A',
            date: '12/08/2026',
            event: 'Siswa A bermain balok dengan tertib.',
            analysis: 'Nilai Agama & Budi Pekerti:\nMenunjukkan sikap santun.',
          },
        ],
        studentChecklists: [
          {
            studentName: 'Siswa A',
            items: [
              {
                no: 1,
                indicator: 'Anak mampu mengucapkan salam secara spontan',
                sudahMuncul: true,
                belumMuncul: false,
                note: 'Mengucapkan salam dengan ramah.',
              },
            ],
          },
        ],
      },
    }

    // @ts-ignore
    const result = await loadWeeklyPlanAssessments({
      userId: 0,
      classId: 0,
      weekStartDate: DateTime.fromISO('2026-08-10'),
      content: customContent,
    })
    assert.equal(result.anecdotes.length, 1)
    assert.equal(result.anecdotes[0].studentName, 'Siswa A')
    assert.include(result.anecdotes[0].analysis, 'Nilai Agama & Budi Pekerti:')
    assert.equal(result.studentChecklists.length, 1)
    assert.equal(result.studentChecklists[0].items.length, 1)
    assert.equal(
      result.studentChecklists[0].items[0].indicator,
      'Anak mampu mengucapkan salam secara spontan'
    )
    assert.equal(result.studentChecklists[0].items[0].note, 'Mengucapkan salam dengan ramah.')
  })

  test('exportWeeklyLessonPlanPdf renders PDF buffer without errors', async ({ assert }) => {
    const { exportWeeklyLessonPlanPdf } = await import('#services/pdf_export_service')
    const mockPlan: any = {
      id: 1,
      theme: 'AKU HAMBA ALLAH',
      weekStartDate: DateTime.fromISO('2026-08-10'),
      status: 'draft',
      schoolClass: { name: 'Kelompok B1', gradeLevel: 0, rombelNumber: 1, nickname: 'Ibrahim' },
      content: {
        theme: 'Aku Hamba Allah',
        subtheme: 'Mengenal Anggota Tubuh',
        identification: {},
        learningDesign: {},
        learningExperience: {},
        assessment: {},
      },
    }
    const mockUser: any = {
      id: 1,
      fullName: 'Fariz Guru',
      schoolName: 'RA Al-Falah',
    }

    const pdfBuffer = await exportWeeklyLessonPlanPdf(mockPlan, mockUser, false)
    assert.isTrue(Buffer.isBuffer(pdfBuffer))
    assert.isAbove(pdfBuffer.length, 500)
  }).timeout(10000)

  test('exportWeeklyLessonPlan renders DOCX buffer without errors', async ({ assert }) => {
    const { exportWeeklyLessonPlan } = await import('#services/export_service')
    const mockPlan: any = {
      id: 1,
      theme: 'AKU HAMBA ALLAH',
      weekStartDate: DateTime.fromISO('2026-08-10'),
      status: 'draft',
      schoolClass: { name: 'Kelompok B1', gradeLevel: 0, rombelNumber: 1, nickname: 'Ibrahim' },
      content: {
        theme: 'Aku Hamba Allah',
        subtheme: 'Mengenal Anggota Tubuh',
        identification: {},
        learningDesign: {},
        learningExperience: {},
        assessment: {},
      },
    }
    const mockUser: any = {
      id: 1,
      fullName: 'Fariz Guru',
      schoolName: 'RA Al-Falah',
    }

    const docxBuffer = await exportWeeklyLessonPlan(mockPlan, mockUser)
    assert.isTrue(Buffer.isBuffer(docxBuffer))
    assert.isAbove(docxBuffer.length, 500)
  }).timeout(10000)
})
