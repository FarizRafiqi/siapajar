import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUsageReservationKeys extends BaseSchema {
  async up() {
    this.schema.alterTable('usage_events', (table) => {
      table.string('reservation_key').nullable().unique()
    })
  }

  async down() {
    this.schema.alterTable('usage_events', (table) => {
      table.dropColumn('reservation_key')
    })
  }
}
