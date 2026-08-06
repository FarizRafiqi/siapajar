import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subjects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name').notNullable()
      table.enum('education_level', ['tk', 'sd']).notNullable()
      table.integer('grade_level').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamps()

      // Cegah mapel ganda saat "Tambah Default" diklik berkali-kali
      table.unique(['user_id', 'name', 'education_level'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
