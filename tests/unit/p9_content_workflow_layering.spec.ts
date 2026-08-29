import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P9 content and document workflow layering', () => {
  test('keeps content, express, and workflow controllers free of persistence and AI logic', async ({
    assert,
  }) => {
    for (const controller of [
      'teaching_modules_controller.ts',
      'lkpds_controller.ts',
      'media_modules_controller.ts',
      'express_tools_controller.ts',
      'document_workflows_controller.ts',
    ]) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /callAi|aiQueueService|ensureDocumentWorkflow|saveDocumentWorkflow/)
      assert.notMatch(
        source,
        /\b(?:TeachingModule|Lkpd|MediaModule|SchoolClass|Subject|WeeklyLessonPlan|DailyLessonPlan|Exam|AnnualPlan|SemesterPlan|ReportNarrative)\.(?:find|findBy|findOrFail|create|query)\s*\(/
      )
    }

    const services: Record<string, string> = {
      'app/controllers/teaching_modules_controller.ts': '#services/teaching_module_service',
      'app/controllers/lkpds_controller.ts': '#services/lkpd_service',
      'app/controllers/media_modules_controller.ts': '#services/media_module_service',
      'app/controllers/express_tools_controller.ts': '#services/express_tools_service',
      'app/controllers/document_workflows_controller.ts':
        '#services/document_workflow_application_service',
    }
    for (const [controller, serviceImport] of Object.entries(services)) {
      assert.include(await readProjectFile(controller), serviceImport)
    }
  })

  test('keeps complex content and document queries behind named repositories', async ({
    assert,
  }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/teaching_module_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClass',
      ],
      'app/repositories/lkpd_repository.ts': ['getIndexData', 'findForUser', 'findOwnedClass'],
      'app/repositories/media_module_repository.ts': [
        'getIndexData',
        'findForUser',
        'findOwnedClass',
      ],
      'app/repositories/express_tools_repository.ts': [
        'getModulAjarData',
        'getLkpdData',
        'getSoalData',
        'getProtaPromesData',
        'getRaporData',
        'listClasses',
      ],
      'app/repositories/document_repository.ts': ['findDocument', 'clone'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps P9 services free of query builders and delegates complex reads', async ({
    assert,
  }) => {
    for (const service of [
      'teaching_module_service.ts',
      'lkpd_service.ts',
      'media_module_service.ts',
      'express_tools_service.ts',
      'document_workflow_application_service.ts',
    ]) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate)\s*\(/)
    }

    assert.include(
      await readProjectFile('app/services/document_workflow_application_service.ts'),
      '#repositories/document_repository'
    )
  })

  test('keeps simple content persistence operations in services', async ({ assert }) => {
    const teaching = await readProjectFile('app/services/teaching_module_service.ts')
    assert.include(teaching, 'TeachingModule.create')
    assert.include(teaching, '.merge(data).save()')

    const lkpd = await readProjectFile('app/services/lkpd_service.ts')
    assert.include(lkpd, 'Lkpd.create')

    const media = await readProjectFile('app/services/media_module_service.ts')
    assert.include(media, 'MediaModule.create')
  })
})
