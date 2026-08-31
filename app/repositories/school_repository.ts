import School from '#models/school'

export class SchoolRepository {
  async findDuplicateByNormalizedName(normalizedName: string) {
    return School.query().whereRaw('LOWER(name) = ?', [normalizedName.toLowerCase()]).first()
  }

  async findOrCreateByNormalizedName(normalizedName: string) {
    let school = await this.findDuplicateByNormalizedName(normalizedName)

    school ??= await School.create({ name: normalizedName })

    return school
  }
}

export const schoolRepository = new SchoolRepository()
