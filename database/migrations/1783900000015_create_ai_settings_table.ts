import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('provider', ['9router', 'anthropic', 'openai']).notNullable().defaultTo('9router')
      table.string('api_key').nullable()
      table.string('base_url').nullable()
      table.string('model').nullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
