import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'semesters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('academic_year_id').unsigned().references('id').inTable('academic_years').onDelete('CASCADE')
      table.string('name').notNullable()
      table.boolean('is_active').defaultTo(false)
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
