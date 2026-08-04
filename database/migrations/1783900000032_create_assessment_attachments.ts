import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAssessmentAttachments extends BaseSchema {
  async up() {
    this.schema.createTable('assessment_attachments', (table) => {
      table.increments('id')
      table.integer('assessment_id').unsigned().references('id').inTable('paud_assessments').onDelete('CASCADE').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.string('original_name').notNullable()
      table.string('stored_name').notNullable()
      table.string('url').notNullable()
      table.string('mime_type').notNullable()
      table.integer('size').unsigned().notNullable()
      table.integer('display_order').unsigned().notNullable().defaultTo(0)
      table.timestamps()
      table.index(['assessment_id', 'display_order'])
    })
  }

  async down() {
    this.schema.dropTable('assessment_attachments')
  }
}
