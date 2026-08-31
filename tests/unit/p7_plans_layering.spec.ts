import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P7 annual and semester plans layering', () => {
  test('keeps annual and semester controllers free of persistence code', async ({ assert }) => {
    for (const controller of ['annual_plans_controller.ts', 'semester_plans_controller.ts']) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(
        source,
        /\b(?:AnnualPlan|AcademicYear|Subject|LearningSequence|SemesterPlan|SchoolClass|Semester)\.(?:find|findBy|findOrFail|create|query)\s*\(/
      )
      assert.notMatch(
        source,
        /\b(?:annualPlan|semesterPlan|schoolClass)\.(?:save|delete|load|preload)\s*\(/
      )
    }

    assert.include(
      await readProjectFile('app/controllers/annual_plans_controller.ts'),
      '#services/annual_plan_service'
    )
    assert.include(
      await readProjectFile('app/controllers/semester_plans_controller.ts'),
      '#services/semester_plan_service'
    )
  })

  test('keeps plan ownership and relationship queries behind repositories', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/annual_plan_repository.ts': ['getIndexData', 'findForUser'],
      'app/repositories/semester_plan_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClass',
      ],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps plan services free of relationship query builders', async ({ assert }) => {
    for (const service of ['annual_plan_service.ts', 'semester_plan_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate)\s*\(/)
      assert.include(source, '#services/curriculum_context_service')
    }
  })

  test('allows simple plan model operations to remain in services', async ({ assert }) => {
    const annual = await readProjectFile('app/services/annual_plan_service.ts')
    assert.include(annual, 'AnnualPlan.create')
    assert.include(annual, '.merge(data).save()')

    const semester = await readProjectFile('app/services/semester_plan_service.ts')
    assert.include(semester, 'SemesterPlan.create')
    assert.include(semester, 'Semester.find')
  })
})
