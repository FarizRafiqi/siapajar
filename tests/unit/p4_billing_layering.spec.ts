import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P4 billing layering', () => {
  test('keeps billing and Mayar controllers free of persistence code', async ({ assert }) => {
    for (const controller of ['account_billing_controller.ts', 'mayar_payments_controller.ts']) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:find|findBy|findOrFail|create|save|load|paginate)\s*\(/)
    }
  })

  test('routes billing and payment use cases through application services', async ({ assert }) => {
    const billingController = await readProjectFile('app/controllers/account_billing_controller.ts')
    assert.include(billingController, '#services/billing_service')

    const mayarController = await readProjectFile('app/controllers/mayar_payments_controller.ts')
    assert.include(mayarController, '#services/mayar_service')
  })

  test('keeps complex billing queries behind named repository methods', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/payment_invoice_repository.ts': [
        'listRecentForUser',
        'paginateForUser',
        'findOwnedByInvoiceNo',
        'findByWebhookReference',
      ],
      'app/repositories/credit_transaction_repository.ts': ['listRecentForUser'],
      'app/repositories/usage_event_repository.ts': ['summarizeForUserPeriod', 'reserveUsage'],
      'app/repositories/package_repository.ts': ['findForCheckout'],
      'app/repositories/package_subscription_repository.ts': [
        'findActiveForUser',
        'paginateForUser',
        'listForUser',
      ],
      'app/repositories/credit_repository.ts': ['deductCredits', 'addCredits'],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps billing services free of transaction and long query builders', async ({ assert }) => {
    for (const service of [
      'billing_service.ts',
      'credit_service.ts',
      'entitlement_service.ts',
      'mayar_service.ts',
    ]) {
      const source = await readProjectFile(`app/services/${service}`)
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\b(?:forUpdate|groupBy|sum|join|whereHas)\s*\(/)
    }

    for (const service of ['billing_service.ts', 'mayar_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)
      assert.notMatch(source, /\.query\s*\(/)
    }
  })

  test('allows simple model operations to remain in services', async ({ assert }) => {
    const creditService = await readProjectFile('app/services/credit_service.ts')
    assert.include(creditService, 'User.findOrFail')

    const entitlementService = await readProjectFile('app/services/entitlement_service.ts')
    assert.include(entitlementService, 'UsageEvent.create')
    assert.include(entitlementService, 'UsageEvent.findBy')

    const mayarService = await readProjectFile('app/services/mayar_service.ts')
    assert.include(mayarService, 'invoice.save')
  })
})
