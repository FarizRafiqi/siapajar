import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateAiJobs extends BaseSchema {
  async up() {
    this.schema.createTable('ai_jobs', (table) => {
      table.increments('id')
      table.string('job_key').notNullable().unique()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.string('combo').notNullable()
      table
        .enum('status', ['pending', 'processing', 'completed', 'failed'])
        .notNullable()
        .defaultTo('pending')
      table.integer('attempts').notNullable().defaultTo(0)
      table.jsonb('payload').notNullable().defaultTo('{}')
      table.jsonb('result').nullable()
      table.text('error').nullable()
      table.timestamp('available_at').notNullable()
      table.timestamp('started_at').nullable()
      table.timestamp('finished_at').nullable()
      table.timestamps()
      table.index(['status', 'available_at'])
    })
  }

  async down() {
    this.schema.dropTable('ai_jobs')
  }
}
