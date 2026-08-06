import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'paud_assessments'

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
        .integer('class_id')
        .unsigned()
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .notNullable()
      table
        .enum('type', ['checklist', 'anecdotal_note', 'work_sample', 'photo_series'])
        .notNullable()
      table.date('date').notNullable()
      table.jsonb('content').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
