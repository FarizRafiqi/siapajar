import { test } from '@japa/runner'
import { rpmKbcRaPrompt } from '#services/ai_prompts'
import { MASTER_KBC_PRESETS } from '../../database/seeders/curriculum_preset_seeder.js'

test.group('RPM KBC RA & Curriculum Presets', () => {
  test('KBC RA master presets contains 18 official weekly themes for semester 1', ({ assert }) => {
    assert.equal(MASTER_KBC_PRESETS.length, 18)

    const week1 = MASTER_KBC_PRESETS.find((p) => p.weekNumber === 1)
    assert.isDefined(week1)
    assert.equal(week1?.themeTitle, 'Kenalkan')
    assert.equal(week1?.subthemeTitle, 'Aku Istimewa: Ayo Kita Berkenalan')
    assert.equal(week1?.semester, 1)

    const week18 = MASTER_KBC_PRESETS.find((p) => p.weekNumber === 18)
    assert.isDefined(week18)
    assert.equal(week18?.themeTitle, 'Bumi')
    assert.equal(week18?.semester, 1)
  })

  test('rpmKbcRaPrompt generates structured JSON instructions with deep learning and loose parts', ({
    assert,
  }) => {
    const prompt = rpmKbcRaPrompt({
      theme: 'Kenalkan',
      subtheme: 'Aku Istimewa: Ayo Kita Berkenalan',
      semester: 1,
      weekNumber: 1,
      groupName: 'B1',
      schoolName: 'RA Al-Falah',
      teacherName: 'Ustadzah Sarah',
      dplSuggestions: ['DPL 1: Keimanan dan Ketakwaan', 'DPL 2: Kewargaan'],
      kbcSuggestions: ['Cinta Alloh dan RosulNya', 'Cinta Diri dan Sesama'],
      loosePartsSuggestions: ['Balok kayu', 'Tutup botol', 'Karton'],
      curriculumContext: {
        objectives: [{ code: 'TP-1.1', title: 'Mengenal ciptaan Allah SWT' }],
      },
    })

    assert.include(prompt.system, 'Rencana Pembelajaran Mendalam (RPM)')
    assert.include(prompt.system, 'Kurikulum Berbasis Cinta (KBC)')
    assert.include(prompt.system, 'dailyCoreActivities')
    assert.include(prompt.user, 'Kenalkan')
    assert.include(prompt.user, 'Aku Istimewa: Ayo Kita Berkenalan')
    assert.include(prompt.user, 'TP-1.1')
    assert.include(prompt.user, 'RA Al-Falah')
  })
})
