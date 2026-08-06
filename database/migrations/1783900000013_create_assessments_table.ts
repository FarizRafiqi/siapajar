import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assessments'

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
      table.string('subject').notNullable()
      table.enum('type', ['formative', 'summative']).notNullable()
      table.string('title').notNullable()
      table.string('learning_objective').nullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
