import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.index(['school_id'], 'users_school_id_index')
    })
    this.schema.alterTable('assessments', (table) => {
      table.index(['semester_id'], 'assessments_semester_id_index')
    })
    this.schema.alterTable('paud_assessments', (table) => {
      table.index(['semester_id'], 'paud_assessments_semester_id_index')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropIndex(['school_id'], 'users_school_id_index')
    })
    this.schema.alterTable('assessments', (table) => {
      table.dropIndex(['semester_id'], 'assessments_semester_id_index')
    })
    this.schema.alterTable('paud_assessments', (table) => {
      table.dropIndex(['semester_id'], 'paud_assessments_semester_id_index')
    })
  }
}
