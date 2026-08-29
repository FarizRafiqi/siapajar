import { test } from '@japa/runner'
import { access, readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

const controllers = [
  'session_controller.ts',
  'new_account_controller.ts',
  'google_auth_controller.ts',
  'onboarding_controller.ts',
  'settings_controller.ts',
  'home_controller.ts',
]

test.group('P1 auth and account layering', () => {
  test('keeps account-facing controllers free of persistence code', async ({ assert }) => {
    for (const controller of controllers) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(
        source,
        /\b(?:User|Package|PackageSubscription|School)\.(?:create|find|findBy)/
      )
      assert.notMatch(source, /\b(?:user|school)\.save\s*\(/)
    }
  })

  test('routes account-facing use cases through application services', async ({ assert }) => {
    const expectedServices: Record<string, string> = {
      'session_controller.ts': '#services/account_service',
      'new_account_controller.ts': '#services/account_service',
      'google_auth_controller.ts': '#services/account_service',
      'onboarding_controller.ts': '#services/onboarding_service',
      'settings_controller.ts': '#services/settings_service',
      'home_controller.ts': '#services/package_service',
    }

    for (const [controller, serviceImport] of Object.entries(expectedServices)) {
      const source = await readProjectFile(`app/controllers/${controller}`)
      assert.include(source, serviceImport)
    }
  })

  test('keeps complex account queries behind named repository methods', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/package_repository.ts': ['listActive'],
      'app/repositories/package_subscription_repository.ts': ['findActiveForUser'],
      'app/repositories/school_repository.ts': ['findOrCreateByNormalizedName'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
      assert.notInclude(source, 'TODO')
    }

    await assert.rejects(() =>
      access(new URL('../../app/repositories/user_repository.ts', import.meta.url))
    )
  })

  test('keeps simple persistence operations in services', async ({ assert }) => {
    const accountService = await readProjectFile('app/services/account_service.ts')
    assert.include(accountService, 'User.verifyCredentials')
    assert.include(accountService, "User.findBy('google_id'")
    assert.include(accountService, "User.findBy('email'")
    assert.include(accountService, "Package.findBy('name', 'free')")
    assert.include(accountService, 'User.create')
    assert.include(accountService, 'PackageSubscription.create')
    assert.include(accountService, 'user.save()')

    const onboardingService = await readProjectFile('app/services/onboarding_service.ts')
    assert.include(onboardingService, 'user.save()')

    const settingsService = await readProjectFile('app/services/settings_service.ts')
    assert.include(settingsService, "user.load('package')")
    assert.include(settingsService, 'user.save()')
  })

  test('services delegate persistence to repositories instead of query builders', async ({
    assert,
  }) => {
    for (const service of [
      'account_service.ts',
      'onboarding_service.ts',
      'settings_service.ts',
      'package_service.ts',
    ]) {
      const source = await readProjectFile(`app/services/${service}`)
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /from '@adonisjs\/lucid\/services\/db'/)
    }
  })
})
