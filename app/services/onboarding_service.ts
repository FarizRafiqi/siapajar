import type User from '#models/user'
import { schoolRepository } from '#repositories/school_repository'
import type { SchoolRepository } from '#repositories/school_repository'

export type OnboardingData = {
  schoolName: string
  educationLevel?: 'tk' | 'sd'
  institutionType?: 'tk' | 'ra'
  curriculumVersion?: string
  defaultGroupContext?: 'a' | 'b'
}

export class OnboardingError extends Error {}

export class OnboardingService {
  constructor(private readonly schools: SchoolRepository = schoolRepository) {}

  async complete(user: User, data: OnboardingData) {
    if (user.role === 'guru' && !data.educationLevel) {
      throw new OnboardingError('Pilih jenjang pendidikan')
    }

    const normalizedName = data.schoolName.trim()
    const school = await this.schools.findOrCreateByNormalizedName(normalizedName)

    user.schoolName = normalizedName
    user.schoolId = school.id
    if (data.educationLevel) {
      const level = data.educationLevel.trim().toLowerCase()
      user.educationLevel = level
      // Do not let the old TK/RA value keep classifying an account as PAUD
      // after switching to SD (or a future non-PAUD level).
      user.institutionType = ['tk', 'paud'].includes(level)
        ? data.institutionType?.trim().toLowerCase() === 'ra'
          ? 'ra'
          : 'tk'
        : null
    }
    if (data.curriculumVersion) user.curriculumVersion = data.curriculumVersion
    if (data.defaultGroupContext) user.defaultGroupContext = data.defaultGroupContext

    await user.save()

    return user
  }
}

export const onboardingService = new OnboardingService()
