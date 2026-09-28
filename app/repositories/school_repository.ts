import School from '#models/school'
import db from '@adonisjs/lucid/services/db'

export class SchoolRepository {
  async listForAdmin() {
    return School.query().withCount('users').orderBy('name', 'asc').orderBy('id', 'asc')
  }

  async findDuplicateByNormalizedName(normalizedName: string, exceptId?: string | number) {
    const query = School.query().whereRaw('LOWER(name) = ?', [normalizedName.toLowerCase()])
    if (exceptId !== undefined) query.whereNot('id', exceptId)
    return query.first()
  }

  async findOrCreateByNormalizedName(normalizedName: string) {
    let school = await this.findDuplicateByNormalizedName(normalizedName)

    school ??= await School.create({ name: normalizedName })

    return school
  }

  async deleteForAdmin(school: School) {
    return db.transaction(async (trx) => {
      await trx
        .from('users')
        .where('school_id', school.id)
        .update({ school_id: null, school_name: null })

      school.useTransaction(trx)
      await school.delete()
    })
  }
}

export const schoolRepository = new SchoolRepository()
