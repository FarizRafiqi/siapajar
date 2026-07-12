import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teaching_modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('class_id').unsigned().references('id').inTable('classes').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('subject').notNullable()
      table.string('phase').notNullable()
      table.jsonb('content').notNullable()
      table.enum('status', ['draft', 'published']).defaultTo('draft')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
