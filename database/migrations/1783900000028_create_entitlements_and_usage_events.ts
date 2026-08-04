import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateEntitlementsAndUsageEvents extends BaseSchema {
  async up() {
    this.schema.createTable('package_entitlements', (table) => {
      table.increments('id')
      table
        .integer('package_id')
        .unsigned()
        .references('id')
        .inTable('packages')
        .onDelete('CASCADE')
        .notNullable()
      table.string('feature_key').notNullable()
      table.integer('limit_value').nullable()
      table.boolean('is_enabled').notNullable().defaultTo(true)
      table.timestamps()
      table.unique(['package_id', 'feature_key'])
    })

    this.schema.createTable('usage_events', (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('event_key').notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.date('period_start').notNullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamps()
      table.index(['user_id', 'event_key', 'period_start'])
    })
  }

  async down() {
    this.schema.dropTable('usage_events')
    this.schema.dropTable('package_entitlements')
  }
}
