import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('auth_mode').notNullable().defaultTo('api_key')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('auth_mode')
    })
  }
}
