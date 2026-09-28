import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * A provider transaction ID is only unique inside its gateway namespace.
 * Nullable values remain allowed while an invoice is being created.
 */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('payment_invoices', (table) => {
      table.unique(
        ['payment_gateway', 'gateway_transaction_id'],
        'payment_invoices_gateway_transaction_unique'
      )
    })
  }

  async down() {
    this.schema.alterTable('payment_invoices', (table) => {
      table.dropUnique(
        ['payment_gateway', 'gateway_transaction_id'],
        'payment_invoices_gateway_transaction_unique'
      )
    })
  }
}
