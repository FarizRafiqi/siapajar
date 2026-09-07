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
    if (data.educationLevel) user.educationLevel = data.educationLevel
    if (data.institutionType) user.institutionType = data.institutionType
    if (data.curriculumVersion) user.curriculumVersion = data.curriculumVersion
    if (data.defaultGroupContext) user.defaultGroupContext = data.defaultGroupContext

    await user.save()

    return user
  }
}

export const onboardingService = new OnboardingService()
