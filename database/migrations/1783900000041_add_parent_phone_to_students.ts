import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddParentPhoneToStudents extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('parent_phone', 20).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('parent_phone')
    })
  }
}
