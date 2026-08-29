import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

const adminControllers = [
  'admin_academic_years_controller.ts',
  'admin_schools_controller.ts',
  'admin_packages_controller.ts',
  'admin_curriculum_presets_controller.ts',
  'admin_entitlements_controller.ts',
  'admin_users_controller.ts',
  'subjects_controller.ts',
]

test.group('P2 admin catalog layering', () => {
  test('keeps admin and subject controllers free of persistence code', async ({ assert }) => {
    for (const controller of adminControllers) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /Database|transaction\s*\(/)
    }
  })

  test('routes admin and subject use cases through application services', async ({ assert }) => {
    for (const controller of adminControllers.slice(0, -1)) {
      const source = await readProjectFile(`app/controllers/${controller}`)
      assert.include(source, '#services/admin_catalog_service')
    }

    const subjects = await readProjectFile('app/controllers/subjects_controller.ts')
    assert.include(subjects, '#services/subject_service')
  })

  test('keeps complex catalog operations behind named repositories', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/curriculum_preset_repository.ts': ['listForAdmin', 'resetDefaults'],
      'app/repositories/package_entitlement_repository.ts': ['listWithEntitlements'],
      'app/repositories/admin_user_repository.ts': ['listForAdmin', 'reassignPackage'],
      'app/repositories/subject_repository.ts': [
        'listForUser',
        'findDuplicate',
        'findOwnedById',
        'replaceWithDefaults',
      ],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }

    const schoolRepository = await readProjectFile('app/repositories/school_repository.ts')
    assert.include(schoolRepository, 'findDuplicateByNormalizedName')
  })

  test('keeps preset reset, subject replacement, and package reassignment in services/repositories', async ({
    assert,
  }) => {
    const catalogService = await readProjectFile('app/services/admin_catalog_service.ts')
    assert.include(catalogService, '#repositories/curriculum_preset_repository')
    assert.include(catalogService, '#repositories/package_entitlement_repository')
    assert.include(catalogService, '#repositories/admin_user_repository')

    const subjectService = await readProjectFile('app/services/subject_service.ts')
    assert.include(subjectService, '#repositories/subject_repository')
  })
})
