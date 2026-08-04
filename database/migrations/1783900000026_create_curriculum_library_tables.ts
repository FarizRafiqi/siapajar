import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCurriculumLibraryTables extends BaseSchema {
  async up() {
    this.schema.createTable('curriculum_cps', (table) => {
      table.increments('id')
      table.string('code').notNullable().unique()
      table.string('element').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('phase').notNullable().defaultTo('Fondasi')
      table.string('curriculum_version').notNullable().defaultTo('Kurikulum Merdeka')
      table.boolean('is_official').notNullable().defaultTo(true)
      table.timestamps()
    })

    this.schema.createTable('learning_objectives', (table) => {
      table.increments('id')
      table
        .integer('cp_id')
        .unsigned()
        .references('id')
        .inTable('curriculum_cps')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()
      table.string('code').notNullable()
      table.text('title').notNullable()
      table.enum('group_context', ['a', 'b']).nullable()
      table.string('source').notNullable().defaultTo('library')
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps()
      table.unique(['cp_id', 'code', 'user_id'])
    })

    this.schema.createTable('learning_sequences', (table) => {
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
      table.string('title').notNullable()
      table.enum('education_level', ['tk', 'sd']).notNullable().defaultTo('tk')
      table.enum('group_context', ['a', 'b']).nullable()
      table.string('curriculum_version').notNullable().defaultTo('Kurikulum Merdeka')
      table.jsonb('items').notNullable().defaultTo('[]')
      table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft')
      table.timestamps()
    })

    this.schema.createTable('iktp_indicators', (table) => {
      table.increments('id')
      table
        .integer('learning_objective_id')
        .unsigned()
        .references('id')
        .inTable('learning_objectives')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()
      table.text('description').notNullable()
      table.string('evidence_type').notNullable().defaultTo('observasi')
      table.text('achievement_criteria').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable('iktp_indicators')
    this.schema.dropTable('learning_sequences')
    this.schema.dropTable('learning_objectives')
    this.schema.dropTable('curriculum_cps')
  }
}
