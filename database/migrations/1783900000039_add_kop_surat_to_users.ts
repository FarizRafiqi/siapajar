import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddKopSuratToUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('kop_surat').nullable().defaultTo('{}')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('kop_surat')
    })
  }
}
