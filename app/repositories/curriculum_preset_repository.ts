import CurriculumPreset from '#models/curriculum_preset'

export type CurriculumPresetResetItem = {
  weekNumber: number
  code: string
  themeTitle: string
  subthemeTitle: string
  groupContext: 'a' | 'b'
  semester: number
  dpl: string[]
  kbcValues: string[]
  looseParts: string[]
  description: string
}

export class CurriculumPresetRepository {
  async listForAdmin(educationLevel: string, semester: number) {
    return CurriculumPreset.query()
      .where('education_level', educationLevel)
      .where('semester', semester)
      .orderBy('sort_order', 'asc')
      .orderBy('week_number', 'asc')
  }

  async resetDefaults(items: readonly CurriculumPresetResetItem[]) {
    for (const item of items) {
      await CurriculumPreset.updateOrCreate(
        { code: item.code },
        {
          educationLevel: 'tk',
          curriculumVersion: 'KBC RA',
          semester: item.semester,
          weekNumber: item.weekNumber,
          code: item.code,
          themeTitle: item.themeTitle,
          subthemeTitle: item.subthemeTitle,
          phase: 'Fondasi',
          groupContext: item.groupContext,
          data: {
            description: item.description,
            dpl: item.dpl,
            kbcValues: item.kbcValues,
            loosePartsSuggestions: item.looseParts,
          },
          isActive: true,
          sortOrder: item.weekNumber,
        }
      )
    }
  }
}

export const curriculumPresetRepository = new CurriculumPresetRepository()
