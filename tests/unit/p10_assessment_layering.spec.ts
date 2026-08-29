import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P10 standard assessment layering', () => {
  test('keeps assessment controllers free of persistence code', async ({ assert }) => {
    for (const controller of [
      'assessments_controller.ts',
      'assessment_attachments_controller.ts',
    ]) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(
        source,
        /\b(?:Assessment|Score|SchoolClass|Student|Subject|Semester|AssessmentAttachment)\.(?:find|findBy|findOrFail|create|query)\s*\(/
      )
    }

    assert.include(
      await readProjectFile('app/controllers/assessments_controller.ts'),
      '#services/assessment_service'
    )
    assert.include(
      await readProjectFile('app/controllers/assessment_attachments_controller.ts'),
      '#services/assessment_attachment_service'
    )
  })

  test('keeps assessment and attachment persistence behind named repositories', async ({
    assert,
  }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/assessment_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClass',
        'findActiveSemester',
        'createWithInitialScores',
        'updateScores',
      ],
      'app/repositories/assessment_attachment_repository.ts': ['findForUser'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps P10 services free of query builders and delegates persistence', async ({
    assert,
  }) => {
    for (const service of ['assessment_service.ts', 'assessment_attachment_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate|transaction)\s*\(/)
      assert.include(source, '#repositories/')
    }
  })

  test('keeps simple assessment deletion in the service', async ({ assert }) => {
    const service = await readProjectFile('app/services/assessment_service.ts')
    assert.include(service, 'assessment.delete()')
  })
})
