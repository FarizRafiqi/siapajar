import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('school_id')
        .unsigned()
        .references('id')
        .inTable('schools')
        .onDelete('SET NULL')
        .nullable()
      table.string('google_id').nullable().unique()
      table.string('avatar_url').nullable()
      // Nullable karena akun yang mendaftar via Google tidak punya password lokal
      table.string('password').nullable().alter()
    })

    // Backfill: kelompokkan user berdasarkan school_name yang sama ke satu baris `schools`
    this.defer(async (db) => {
      const rows = await db.from('users').whereNotNull('school_name').distinct('school_name')
      for (const { school_name: schoolName } of rows) {
        if (!schoolName) continue
        const [inserted] = await db
          .table('schools')
          .insert({ name: schoolName, created_at: new Date(), updated_at: new Date() })
          .returning('id')
        const schoolId = typeof inserted === 'object' ? inserted.id : inserted
        await db.from('users').where('school_name', schoolName).update({ school_id: schoolId })
      }
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('school_id')
      table.dropColumn('google_id')
      table.dropColumn('avatar_url')
    })
  }
}
