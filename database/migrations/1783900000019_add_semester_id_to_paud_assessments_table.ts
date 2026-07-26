import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'paud_assessments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('semester_id')
        .unsigned()
        .references('id')
        .inTable('semesters')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('semester_id')
    })
  }
}
