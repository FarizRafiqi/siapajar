import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'paud_assessments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('achievement_status')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('achievement_status').nullable()
    })
  }
}
