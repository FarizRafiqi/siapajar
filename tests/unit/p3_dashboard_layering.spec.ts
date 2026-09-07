import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P3 dashboard layering', () => {
  test('keeps dashboard controllers free of persistence code', async ({ assert }) => {
    for (const controller of ['dashboard_controller.ts', 'principal_dashboard_controller.ts']) {
      const source = await readProjectFile(`app/controllers/${controller}`)
      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:count|groupBy|join|whereHas|preload)\s*\(/)
    }
  })

  test('routes teacher and principal dashboards through services', async ({ assert }) => {
    const dashboard = await readProjectFile('app/controllers/dashboard_controller.ts')
    assert.include(dashboard, '#services/dashboard_service')

    const principal = await readProjectFile('app/controllers/principal_dashboard_controller.ts')
    assert.include(principal, '#services/principal_dashboard_service')
  })

  test('keeps dashboard read models behind named repository methods', async ({ assert }) => {
    const dashboardRepository = await readProjectFile('app/repositories/dashboard_repository.ts')
    for (const method of ['getTeacherStats', 'getAdminStats', 'getRecentResources']) {
      assert.match(dashboardRepository, new RegExp(`(?:async )?${method}\\s*\\(`))
    }

    const principalRepository = await readProjectFile(
      'app/repositories/principal_dashboard_repository.ts'
    )
    for (const method of ['getTeachersWithCounts', 'findTeacherDetail']) {
      assert.match(principalRepository, new RegExp(`(?:async )?${method}\\s*\\(`))
    }
  })

  test('keeps dashboard services focused on orchestration and DTO shaping', async ({ assert }) => {
    for (const service of ['dashboard_service.ts', 'principal_dashboard_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)
      assert.notMatch(source, /\.query\s*\(/)
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    }
  })
})
