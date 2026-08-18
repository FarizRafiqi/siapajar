import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRombelNumberToClassesTable extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('rombel_number', 10).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('rombel_number')
    })
  }
}
