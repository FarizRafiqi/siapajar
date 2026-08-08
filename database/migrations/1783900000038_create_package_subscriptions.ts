import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreatePackageSubscriptions extends BaseSchema {
  protected tableName = 'package_subscriptions'

  async up() {
    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('package_id')
        .unsigned()
        .references('id')
        .inTable('packages')
        .onDelete('SET NULL')
        .nullable()
      table.string('status').notNullable().defaultTo('active')
      table.string('billing_cycle').notNullable().defaultTo('manual')
      table.timestamp('starts_at').notNullable()
      table.timestamp('ends_at').nullable()
      table.timestamp('canceled_at').nullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamps()
      table.index(['user_id', 'status'])
      table.index(['user_id', 'starts_at'])
    })
  }

  async down() {
    await this.schema.dropTable(this.tableName)
  }
}
