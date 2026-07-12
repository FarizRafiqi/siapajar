import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
      table.string('title').notNullable()
      table.enum('type', ['midterm', 'final', 'daily', 'summative']).notNullable()
      table.jsonb('questions').notNullable()
      table.enum('status', ['draft', 'published']).defaultTo('draft')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
