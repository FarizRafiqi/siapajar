import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRememberMeTokensTable extends BaseSchema {
  protected tableName = 'remember_me_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('tokenable_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('hash').notNullable()
      table.timestamp('expires_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
