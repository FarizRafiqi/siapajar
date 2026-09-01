import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.timestamp('email_verified_at', { useTz: true }).nullable()
      // Existing accounts retain their entitlement; only newly registered accounts start pending.
      table.string('free_benefit_status', 24).notNullable().defaultTo('legacy')
      table.timestamp('email_change_requested_at', { useTz: true }).nullable()
    })

    this.schema.createTable('email_verification_tokens', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('token_hash', 128).notNullable().unique()
      table.string('purpose', 32).notNullable().defaultTo('email_verification')
      table.string('target_email', 254).nullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.timestamp('used_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.index(['user_id', 'expires_at'])
    })

    this.schema.createTable('free_benefit_claims', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('email_hash', 128).notNullable().unique()
      table.string('device_hash', 128).notNullable().unique()
      table.string('ip_hash', 128).notNullable().unique()
      table.string('source', 32).notNullable()
      table.timestamp('claimed_at', { useTz: true }).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('fraud_cases', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('type', 64).notNullable()
      table.string('status', 24).notNullable().defaultTo('open')
      table.jsonb('evidence').notNullable()
      table
        .integer('reviewed_by_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('reviewed_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.index(['status', 'created_at'])
      table.index(['user_id', 'created_at'])
    })

    this.schema.alterTable('payment_invoices', (table) => {
      table.string('gateway_invoice_id', 128).nullable().unique()
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.alterTable('payment_invoices', (table) => {
      table.dropColumn('gateway_invoice_id')
      table.dropColumn('expires_at')
    })
    this.schema.dropTableIfExists('fraud_cases')
    this.schema.dropTableIfExists('free_benefit_claims')
    this.schema.dropTableIfExists('email_verification_tokens')
    this.schema.alterTable('users', (table) => {
      table.dropColumn('email_verified_at')
      table.dropColumn('free_benefit_status')
      table.dropColumn('email_change_requested_at')
    })
  }
}
