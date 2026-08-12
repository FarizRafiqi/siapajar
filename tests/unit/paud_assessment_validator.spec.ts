import { test } from '@japa/runner'
import {
  createPaudAssessmentValidator,
  updatePaudAssessmentValidator,
} from '#validators/paud_assessment'

test.group('PAUD assessment validator', () => {
  const basePayload = {
    classId: 1,
    semesterId: 1,
    studentId: 2,
    type: 'checklist' as const,
    date: '2026-08-12',
    content: {},
  }

  test('create assessment without achievementStatus passes with undefined status', async ({
    assert,
  }) => {
    const validated = await createPaudAssessmentValidator.validate(basePayload)
    assert.isUndefined(validated.achievementStatus)
  })

  test('create assessment with all 4 descriptive achievementStatus enums passes', async ({
    assert,
  }) => {
    const statuses = [
      'belum_terlihat',
      'mulai_berkembang',
      'berkembang_sesuai_harapan',
      'berkembang_sangat_baik',
    ] as const

    for (const status of statuses) {
      const validated = await createPaudAssessmentValidator.validate({
        ...basePayload,
        achievementStatus: status,
      })
      assert.equal(validated.achievementStatus, status)
    }
  })

  test('update assessment without achievementStatus passes', async ({ assert }) => {
    const validated = await updatePaudAssessmentValidator.validate({
      activity: 'Kegiatan Bermain',
    })
    assert.isUndefined(validated.achievementStatus)
  })

  test('create assessment with non-enum achievementStatus is rejected', async ({ assert }) => {
    await assert.rejects(async () => {
      await createPaudAssessmentValidator.validate({
        ...basePayload,
        achievementStatus: 'BSB' as any,
      })
    })
  })
})
