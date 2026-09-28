import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAuditActionCreatedAtIndex extends BaseSchema {
  async up() {
    this.schema.alterTable('audit_logs', (table) => {
      table.index(['action', 'created_at'], 'audit_logs_action_created_at_idx')
    })
  }

  async down() {
    this.schema.alterTable('audit_logs', (table) => {
      table.dropIndex(['action', 'created_at'], 'audit_logs_action_created_at_idx')
    })
  }
}
