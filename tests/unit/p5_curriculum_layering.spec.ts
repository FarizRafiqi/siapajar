import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P5 curriculum layering', () => {
  test('keeps curriculum controller free of persistence code', async ({ assert }) => {
    const source = await readProjectFile('app/controllers/curriculum_controller.ts')

    assert.notInclude(source, "from '#models/")
    assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(source, /\.query\s*\(/)
    assert.notMatch(source, /\b(?:find|findBy|findOrFail|create|save|delete|load)\s*\(/)
    assert.include(source, '#services/curriculum_service')
  })

  test('keeps curriculum context orchestration free of direct queries', async ({ assert }) => {
    const source = await readProjectFile('app/services/curriculum_context_service.ts')

    assert.notInclude(source, "from '#models/")
    assert.notMatch(source, /\.query\s*\(/)
    assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    assert.include(source, '#repositories/curriculum_repository')
  })

  test('keeps complex curriculum reads and cleanup behind named repository methods', async ({
    assert,
  }) => {
    const source = await readProjectFile('app/repositories/curriculum_repository.ts')
    for (const method of [
      'getIndexData',
      'getExportData',
      'findAccessibleObjective',
      'findSequenceForUser',
      'findObjectiveByCode',
      'findIndicatorByDescription',
      'findSequenceByTitle',
      'countAccessibleObjectives',
      'listBaseCps',
      'deleteUserPresetData',
      'findContextSequence',
      'listContextObjectives',
    ]) {
      assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
    }
  })

  test('keeps curriculum services focused on business orchestration', async ({ assert }) => {
    const service = await readProjectFile('app/services/curriculum_service.ts')

    assert.notInclude(service, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(service, /\b(?:whereIn|whereNull|preload|groupBy|forUpdate)\s*\(/)
    assert.include(service, '#repositories/curriculum_repository')
  })

  test('allows simple curriculum model operations to remain in the service', async ({ assert }) => {
    const service = await readProjectFile('app/services/curriculum_service.ts')

    assert.include(service, 'CurriculumCp.find')
    assert.include(service, 'LearningObjective.create')
    assert.include(service, 'LearningSequence.create')
    assert.include(service, 'await sequence.merge(data).save()')
  })
})
