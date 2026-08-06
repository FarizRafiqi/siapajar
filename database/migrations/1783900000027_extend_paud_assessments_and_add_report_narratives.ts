import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ExtendPaudAssessmentsAndAddReportNarratives extends BaseSchema {
  async up() {
    this.schema.alterTable('paud_assessments', (table) => {
      table
        .integer('learning_objective_id')
        .unsigned()
        .references('id')
        .inTable('learning_objectives')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('iktp_indicator_id')
        .unsigned()
        .references('id')
        .inTable('iktp_indicators')
        .onDelete('SET NULL')
        .nullable()
      table.string('achievement_status').nullable()
      table.text('activity').nullable()
      table.text('teacher_note').nullable()
      table.string('evidence_url').nullable()
      table.string('evidence_type').nullable()
    })

    this.schema.createTable('report_narratives', (table) => {
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
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('semester_id')
        .unsigned()
        .references('id')
        .inTable('semesters')
        .onDelete('CASCADE')
        .notNullable()
      table.string('element').notNullable()
      table.text('content').notNullable().defaultTo('')
      table.enum('status', ['draft', 'approved']).notNullable().defaultTo('draft')
      table.timestamp('approved_at').nullable()
      table.timestamps()
      table.unique(['student_id', 'semester_id', 'element'])
    })
  }

  async down() {
    this.schema.dropTable('report_narratives')
    this.schema.alterTable('paud_assessments', (table) => {
      table.dropColumn('learning_objective_id')
      table.dropColumn('iktp_indicator_id')
      table.dropColumn('achievement_status')
      table.dropColumn('activity')
      table.dropColumn('teacher_note')
      table.dropColumn('evidence_url')
      table.dropColumn('evidence_type')
    })
  }
}
