import { BaseSchema } from '@adonisjs/lucid/schema'

/** Keep the persisted AI job field aligned with its actual business meaning. */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('ai_jobs', (table) => {
      table.renameColumn('combo', 'operation')
    })
  }

  async down() {
    this.schema.alterTable('ai_jobs', (table) => {
      table.renameColumn('operation', 'combo')
    })
  }
}
