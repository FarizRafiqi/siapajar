import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateMediaModulesTable extends BaseSchema {
  protected tableName = 'media_modules'

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
      table.jsonb('slides').notNullable()
      table.jsonb('loose_parts_guide').nullable()
      table.enum('status', ['draft', 'published']).defaultTo('draft')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
