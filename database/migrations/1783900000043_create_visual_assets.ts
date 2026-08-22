import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateVisualAssetsTable extends BaseSchema {
  protected tableName = 'visual_assets'

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
        .integer('school_id')
        .unsigned()
        .references('id')
        .inTable('schools')
        .onDelete('SET NULL')
        .nullable()
      table.string('source').notNullable()
      table.string('kind').notNullable()
      table.string('status').notNullable().defaultTo('ready')
      table.string('mime_type').notNullable()
      table.string('url').notNullable()
      table.text('storage_path').notNullable()
      table.text('prompt').nullable()
      table.string('prompt_hash').nullable()
      table.string('provider').nullable()
      table.string('model').nullable()
      table.string('view_box').nullable()
      table.integer('width').unsigned().nullable()
      table.integer('height').unsigned().nullable()
      table.text('error').nullable()
      table.jsonb('metadata').notNullable().defaultTo('{}')
      table.timestamps()
      table.index(['user_id', 'prompt_hash'])
      table.index(['school_id', 'prompt_hash'])
      table.index(['source', 'kind', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
