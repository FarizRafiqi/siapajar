import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'packages'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_highlighted').notNullable().defaultTo(false)
      table.string('cta_label').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_highlighted')
      table.dropColumn('cta_label')
    })
  }
}
