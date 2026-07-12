import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddOnboardingToUsersTable extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('school_name').nullable()
      table.string('education_level').nullable() // 'tk' or 'sd'
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('school_name')
      table.dropColumn('education_level')
    })
  }
}
