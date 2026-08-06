import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAuditLogs extends BaseSchema {
  async up() {
    this.schema.createTable('audit_logs', (table) => {
      table.increments('id')
      table
        .integer('actor_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table.string('action').notNullable()
      table.string('entity_type').nullable()
      table.string('entity_id').nullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
      table.timestamp('created_at').notNullable()
      table.index(['actor_id', 'action'])
      table.index(['entity_type', 'entity_id'])
    })
  }

  async down() {
    this.schema.dropTable('audit_logs')
  }
}
