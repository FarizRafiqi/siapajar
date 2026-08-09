import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mcp_keys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('key_hash', 64).notNullable().unique()
      table.string('label', 100).notNullable()
      table.jsonb('scopes').nullable()
      table.timestamp('last_used_at', { useTz: true }).nullable()
      table.timestamp('revoked_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['key_hash'], 'mcp_keys_key_hash_index')
      table.index(['user_id'], 'mcp_keys_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
