import School from '#models/school'

export class SchoolRepository {
  async findOrCreateByNormalizedName(normalizedName: string) {
    let school = await School.query()
      .whereRaw('LOWER(name) = ?', [normalizedName.toLowerCase()])
      .first()

    school ??= await School.create({ name: normalizedName })

    return school
  }
}

export const schoolRepository = new SchoolRepository()
