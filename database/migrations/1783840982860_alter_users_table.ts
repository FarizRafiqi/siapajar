import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role').notNullable().defaultTo('guru')
      // SET NULL, bukan RESTRICT — menghapus paket tidak boleh terkunci oleh user yang memakainya
      table
        .integer('package_id')
        .unsigned()
        .references('id')
        .inTable('packages')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('package_id')
      table.dropColumn('role')
    })
  }
}
