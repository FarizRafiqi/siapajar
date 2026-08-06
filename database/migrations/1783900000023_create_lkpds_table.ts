import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateLkpdsTable extends BaseSchema {
  protected tableName = 'lkpds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('class_id')
        .unsigned()
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title').notNullable()
      table.string('theme').notNullable()
      table.string('subtheme').nullable()
      table.string('age_group').defaultTo('Kelompok B (5-6 Tahun)')
      table.string('institution_type').defaultTo('TK')
      table.jsonb('content').notNullable()
      table.enum('status', ['draft', 'published']).defaultTo('draft')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
