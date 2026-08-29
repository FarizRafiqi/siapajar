import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P13 AI and infrastructure layering', () => {
  test('keeps AI settings controller and health route free of persistence code', async ({
    assert,
  }) => {
    const controller = await readProjectFile('app/controllers/admin_ai_settings_controller.ts')
    const routes = await readProjectFile('start/routes.ts')

    assert.notInclude(controller, "from '#models/")
    assert.notInclude(controller, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(controller, /\.query\s*\(|\.save\s*\(/)
    assert.notMatch(controller, /\bAiSetting\./)
    assert.include(controller, '#services/ai_settings_service')

    assert.notInclude(routes, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(routes, /\bdb\.rawQuery\s*\(/)
    assert.include(routes, '#services/health_service')
  })

  test('keeps AI, asset, and background persistence behind named repositories', async ({
    assert,
  }) => {
    const persistenceConsumers = [
      'app/services/ai_service.ts',
      'app/services/ai_queue_service.ts',
      'app/services/visual_asset_service.ts',
      'app/services/ai_settings_service.ts',
      'app/jobs/generate_ai_json.ts',
      'app/jobs/generate_ai_image.ts',
      'app/jobs/generate_ai_svg.ts',
      'app/jobs/generate_narratives.ts',
      'app/jobs/write_audit_log.ts',
    ]

    for (const path of persistenceConsumers) {
      const source = await readProjectFile(path)

      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(
        source,
        /\b(?:AiJob|User|AiSetting|VisualAsset|ReportNarrative|AuditLog)\.(?:find|findBy|findOrFail|findByOrFail|firstOrCreate|create|updateOrCreate|query)\s*\(/
      )
      assert.include(source, '#repositories/')
    }
  })

  test('defines named repositories for AI and infrastructure persistence', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/ai_setting_repository.ts': ['current'],
      'app/repositories/ai_job_repository.ts': [
        'findOrCreate',
        'findByJobKeyOrFail',
        'findById',
        'findOwner',
        'findOwnerOrFail',
        'markProcessing',
        'markCompleted',
        'markFailed',
      ],
      'app/repositories/visual_asset_repository.ts': [
        'findCached',
        'createReadyAsset',
        'createUploadedAsset',
      ],
      'app/repositories/audit_log_repository.ts': ['record'],
      'app/repositories/infrastructure_repository.ts': ['pingDatabase'],
      'app/repositories/report_card_repository.ts': ['upsertGeneratedNarrative'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps health checks behind an application service', async ({ assert }) => {
    const source = await readProjectFile('app/services/health_service.ts')

    assert.include(source, '#repositories/infrastructure_repository')
    assert.notMatch(source, /\brawQuery\s*\(/)
  })
})
