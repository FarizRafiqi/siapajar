import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P12 exam and generation layering', () => {
  test('keeps the exams controller free of persistence and generation orchestration', async ({
    assert,
  }) => {
    const source = await readProjectFile('app/controllers/exams_controller.ts')

    assert.notInclude(source, "from '#models/")
    assert.notInclude(source, "from '#jobs/")
    assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(source, /\.query\s*\(/)
    assert.notMatch(
      source,
      /\b(?:Exam|SchoolClass|Subject|User)\.(?:find|findBy|findOrFail|create|updateOrCreate)\s*\(/
    )
    assert.notMatch(
      source,
      /\b(?:dispatch|persistUploadedVisualAsset|exportExam|exportExamPdf)\s*\(/
    )
    assert.include(source, '#services/exam_service')
  })

  test('keeps exam queries behind named repository methods', async ({ assert }) => {
    const source = await readProjectFile('app/repositories/exam_repository.ts')

    for (const method of [
      'getIndexData',
      'findForUser',
      'findOwnedClass',
      'findForGeneration',
      'findUserForGeneration',
    ]) {
      assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
    }
  })

  test('keeps exam services free of query builders', async ({ assert }) => {
    for (const service of ['exam_service.ts', 'exam_generation_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate|transaction)\s*\(/)
      assert.include(source, '#repositories/')
    }
  })
})
