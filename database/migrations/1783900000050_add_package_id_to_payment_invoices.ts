import { BaseSchema } from '@adonisjs/lucid/schema'

/** Keep the purchased catalog row with the immutable invoice snapshot. */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('payment_invoices', (table) => {
      table
        .integer('package_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('packages')
        .onDelete('SET NULL')
      table.index(['package_id'])
    })
  }

  async down() {
    this.schema.alterTable('payment_invoices', (table) => {
      table.dropIndex(['package_id'])
      table.dropColumn('package_id')
    })
  }
}
