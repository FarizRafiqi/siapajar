import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateParentReflections extends BaseSchema {
  protected tableName = 'parent_reflections'

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
        .integer('semester_id')
        .unsigned()
        .references('id')
        .inTable('semesters')
        .onDelete('CASCADE')
        .notNullable()
      table.text('content').nullable()

      table.timestamps()
      table.unique(['user_id', 'student_id', 'semester_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
