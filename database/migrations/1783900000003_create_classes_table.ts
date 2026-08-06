import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

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
      table
        .integer('academic_year_id')
        .unsigned()
        .references('id')
        .inTable('academic_years')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name').notNullable()
      table.integer('grade_level').notNullable()
      table.timestamps()

      // Satu guru tidak boleh punya dua kelas bernama sama di tahun ajaran yang sama
      table.unique(['user_id', 'academic_year_id', 'name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
