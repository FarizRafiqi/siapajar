import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('assessment_id')
        .unsigned()
        .references('id')
        .inTable('assessments')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .notNullable()
      table.decimal('value', 5, 2).nullable()
      table.string('note').nullable()
      table.timestamps()

      table.unique(['assessment_id', 'student_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
