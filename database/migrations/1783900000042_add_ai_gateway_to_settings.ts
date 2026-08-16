import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Keep legacy `provider` values intact. `gateway` selects an optional
      // OpenAI-compatible aggregator without conflating it with 9router.
      table.string('gateway').nullable()
      table.string('reasoning_effort').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gateway')
      table.dropColumn('reasoning_effort')
    })
  }
}
