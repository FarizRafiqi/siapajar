import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { loadWeeklyPlanAssessments } from '#services/weekly_assessment_loader'

test.group('Weekly Assessment Loader', () => {
  test('returns default template structures gracefully when no user_id is provided', async ({
    assert,
  }) => {
    // @ts-ignore
    const result = await loadWeeklyPlanAssessments({ userId: 0, classId: 0, weekStartDate: null })
    assert.deepEqual(result.anecdotes, [])
    assert.equal(result.checklists.length, 12)
    assert.deepEqual(result.workSamples, [])
    assert.deepEqual(result.photoSeries, [])
  })

  test('extracts indicators correctly from standard RPM content', async ({ assert }) => {
    const customContent = {
      assessment: {
        indicators: [
          { indicator: 'Anak mampu mengucapkan salam secara spontan' },
          { indicator: 'Anak mampu merapikan alat bermain sendiri' },
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
    assert.equal(result.checklists.length, 2)
    assert.equal(result.checklists[0].indicator, 'Anak mampu mengucapkan salam secara spontan')
    assert.equal(result.checklists[1].indicator, 'Anak mampu merapikan alat bermain sendiri')
  })

  test('falls back to default 12 IKTP indicators when content indicators are missing', async ({
    assert,
  }) => {
    // @ts-ignore
    const result = await loadWeeklyPlanAssessments({
      userId: 0,
      classId: 0,
      weekStartDate: DateTime.fromISO('2026-08-10'),
      content: {},
    })
    assert.equal(result.checklists.length, 12)
    assert.include(result.checklists[0].indicator, 'Mengenal dan meniru doa-doa harian')
    assert.include(result.checklists[11].indicator, 'Mengekspresikan ide')
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
  })
})
