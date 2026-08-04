import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('oauth_access_token').nullable()
      table.text('oauth_refresh_token').nullable()
      table.timestamp('oauth_expires_at').nullable()
      table.string('oauth_email').nullable()
      table.string('oauth_project_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('oauth_access_token')
      table.dropColumn('oauth_refresh_token')
      table.dropColumn('oauth_expires_at')
      table.dropColumn('oauth_email')
      table.dropColumn('oauth_project_id')
    })
  }
}
