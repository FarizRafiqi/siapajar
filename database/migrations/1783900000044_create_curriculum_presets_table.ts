import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCurriculumPresetsTable extends BaseSchema {
  protected tableName = 'curriculum_presets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('education_level', 20).notNullable().defaultTo('tk') // 'tk' | 'sd' | 'smp' | 'sma'
      table.string('curriculum_version', 50).notNullable().defaultTo('KBC RA') // 'KBC RA' | 'Kurikulum Merdeka'
      table.integer('semester').notNullable().defaultTo(1) // 1 | 2
      table.integer('week_number').nullable() // 1..18 for weekly themes
      table.string('code', 50).notNullable() // e.g. 'TEMA-01-KENALKAN'
      table.string('theme_title', 255).notNullable() // e.g. 'Kenalkan'
      table.string('subtheme_title', 255).nullable() // e.g. 'Aku Istimewa: Ayo Kita Berkenalan'
      table.string('phase', 50).notNullable().defaultTo('Fondasi') // 'Fondasi' | 'A' | 'B' | 'C'
      table.string('group_context', 10).nullable().defaultTo('b') // 'a' | 'b' | null
      table.jsonb('data').notNullable().defaultTo('{}') // objectives, indicators, dpl, kbcValues, materials, activities
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('sort_order').notNullable().defaultTo(1)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index(['education_level', 'semester', 'is_active'])
      table.index(['week_number', 'is_active'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
