import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('class_id')
        .unsigned()
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .notNullable()
      table.string('nis').notNullable()
      table.string('full_name').notNullable()
      table.timestamps()

      // NIS harus unik dalam satu kelas
      table.unique(['class_id', 'nis'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
