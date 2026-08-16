import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exams'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('generation_status', [
          'queued',
          'researching',
          'generating_questions',
          'generating_images',
          'completed',
          'failed',
        ])
        .notNullable()
        .defaultTo('completed')
      table.jsonb('generation_progress').notNullable().defaultTo('{}')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('generation_status')
      table.dropColumn('generation_progress')
    })
  }
}
