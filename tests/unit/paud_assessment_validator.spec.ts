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

  test('create assessment without achievementStatus passes', async ({ assert }) => {
    const validated = await createPaudAssessmentValidator.validate(basePayload)
    assert.notProperty(validated, 'achievementStatus')
  })

  test('create assessment with achievementStatus in payload passes but strips achievementStatus', async ({
    assert,
  }) => {
    const validated = await createPaudAssessmentValidator.validate({
      ...basePayload,
      achievementStatus: 'mulai_berkembang',
    } as any)
    assert.notProperty(validated, 'achievementStatus')
  })

  test('update assessment without achievementStatus passes', async ({ assert }) => {
    const validated = await updatePaudAssessmentValidator.validate({
      activity: 'Kegiatan Bermain',
    })
    assert.notProperty(validated, 'achievementStatus')
  })
})
