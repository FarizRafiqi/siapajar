import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

export default class DailyLessonPlan extends BaseModel {
  static readonly table = 'daily_lesson_plans'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'class_id' })
  declare classId: number

  @column({ columnName: 'weekly_lesson_plan_id' })
  declare weeklyLessonPlanId: number | null

  @column.date()
  declare date: DateTime

  @column({
    columnName: 'content',
    prepare: (value: Record<string, any>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare content: Record<string, any>

  @column()
  declare status: 'draft' | 'published'

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SchoolClass, { foreignKey: 'classId' })
  declare schoolClass: BelongsTo<typeof SchoolClass>

  @belongsTo(() => WeeklyLessonPlan, { foreignKey: 'weeklyLessonPlanId' })
  declare weeklyLessonPlan: BelongsTo<typeof WeeklyLessonPlan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
