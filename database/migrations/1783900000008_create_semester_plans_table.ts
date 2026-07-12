import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'semester_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
      table.integer('semester_id').unsigned().references('id').inTable('semesters').onDelete('CASCADE')
      table.string('subject').notNullable()
      table.jsonb('content').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
