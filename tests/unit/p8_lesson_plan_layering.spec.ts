import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P8 weekly and daily lesson plan layering', () => {
  test('keeps weekly and daily controllers free of persistence and business logic', async ({
    assert,
  }) => {
    for (const controller of [
      'weekly_lesson_plans_controller.ts',
      'daily_lesson_plans_controller.ts',
    ]) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:find|findBy|findOrFail|create|save|delete|load|preload)\s*\(/)
      assert.notMatch(source, /function\s+(?:normalize|extract|getNonEmpty|format)/)
    }

    assert.include(
      await readProjectFile('app/controllers/weekly_lesson_plans_controller.ts'),
      '#services/weekly_lesson_plan_service'
    )
    assert.include(
      await readProjectFile('app/controllers/daily_lesson_plans_controller.ts'),
      '#services/daily_lesson_plan_service'
    )
  })

  test('keeps lesson plan and assessment queries behind named repositories', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/weekly_lesson_plan_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClassWithStudents',
        'findPreset',
      ],
      'app/repositories/daily_lesson_plan_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClass',
        'findWeeklyPlanForUser',
      ],
      'app/repositories/weekly_assessment_repository.ts': ['findForWeeklyPlan'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps lesson plan services and assessment loader free of query builders', async ({
    assert,
  }) => {
    for (const service of [
      'weekly_lesson_plan_service.ts',
      'daily_lesson_plan_service.ts',
      'weekly_assessment_loader.ts',
    ]) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate)\s*\(/)
    }

    assert.include(
      await readProjectFile('app/services/weekly_assessment_loader.ts'),
      '#repositories/weekly_assessment_repository'
    )
  })

  test('allows simple lesson plan persistence operations to remain in services', async ({
    assert,
  }) => {
    const weekly = await readProjectFile('app/services/weekly_lesson_plan_service.ts')
    assert.include(weekly, 'WeeklyLessonPlan.create')
    assert.include(weekly, '.merge(data).save()')

    const daily = await readProjectFile('app/services/daily_lesson_plan_service.ts')
    assert.include(daily, 'DailyLessonPlan.create')
    assert.include(daily, '.merge(data).save()')
  })
})
