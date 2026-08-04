import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateDocumentWorkflows extends BaseSchema {
  async up() {
    this.schema.createTable('document_workflows', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.string('document_type').notNullable()
      table.integer('document_id').unsigned().notNullable()
      table.enum('status', ['draft', 'published', 'archived']).notNullable().defaultTo('draft')
      table.timestamp('last_saved_at').nullable()
      table.string('template_key').nullable()
      table.integer('version').unsigned().notNullable().defaultTo(1)
      table.timestamps()
      table.unique(['user_id', 'document_type', 'document_id'])
      table.index(['user_id', 'document_type', 'status'])
    })
  }

  async down() {
    this.schema.dropTable('document_workflows')
  }
}
