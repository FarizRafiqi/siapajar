import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'daily_lesson_plans'

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
        .integer('weekly_lesson_plan_id')
        .unsigned()
        .references('id')
        .inTable('weekly_lesson_plans')
        .onDelete('SET NULL')
        .nullable()
      table.date('date').notNullable()
      table.jsonb('content').notNullable()
      table.enum('status', ['draft', 'published']).defaultTo('draft')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
