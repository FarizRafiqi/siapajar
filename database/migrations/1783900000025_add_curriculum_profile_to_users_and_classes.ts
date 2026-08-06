import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCurriculumProfileToUsersAndClasses extends BaseSchema {
  protected usersTable = 'users'
  protected classesTable = 'classes'

  async up() {
    this.schema.alterTable(this.usersTable, (table) => {
      table.enum('institution_type', ['tk', 'ra']).nullable()
      table.string('curriculum_version').nullable()
      table.enum('default_group_context', ['a', 'b']).nullable()
    })

    this.schema.alterTable(this.classesTable, (table) => {
      table.enum('group_context', ['a', 'b']).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.usersTable, (table) => {
      table.dropColumn('institution_type')
      table.dropColumn('curriculum_version')
      table.dropColumn('default_group_context')
    })
    this.schema.alterTable(this.classesTable, (table) => {
      table.dropColumn('group_context')
    })
  }
}
