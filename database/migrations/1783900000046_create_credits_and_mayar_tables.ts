import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.integer('credits_balance').notNullable().defaultTo(10)
    })

    this.schema.createTable('credit_transactions', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('amount').notNullable()
      table.integer('balance_after').notNullable()
      table.string('type', 50).notNullable() // 'signup_bonus' | 'topup' | 'usage' | 'refund'
      table.string('description', 255).notNullable()
      table.jsonb('metadata').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'created_at'])
    })

    this.schema.createTable('payment_invoices', (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('invoice_no', 64).notNullable().unique()
      table.string('package_name', 100).notNullable()
      table.integer('credits_amount').notNullable().defaultTo(0)
      table.integer('gross_amount').notNullable()
      table.string('status', 30).notNullable().defaultTo('pending') // 'pending' | 'paid' | 'expired' | 'failed'
      table.string('mayar_transaction_id', 128).nullable()
      table.text('mayar_payment_url').nullable()
      table.timestamp('paid_at', { useTz: true }).nullable()
      table.jsonb('metadata').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'status'])
      table.index(['invoice_no'])
    })
  }

  async down() {
    this.schema.dropTableIfExists('payment_invoices')
    this.schema.dropTableIfExists('credit_transactions')
    this.schema.alterTable('users', (table) => {
      table.dropColumn('credits_balance')
    })
  }
}
