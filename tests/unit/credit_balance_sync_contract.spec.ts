import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('credit balance reconciliation', () => {
  test('keeps reconciliation in the repository and service layers', async ({ assert }) => {
    const repository = await readProjectFile('app/repositories/credit_repository.ts')
    const service = await readProjectFile('app/services/credit_service.ts')

    assert.match(repository, /synchronizeUserBalance\s*\(/)
    assert.match(repository, /synchronizeAllUserBalances\s*\(/)
    assert.include(repository, 'skipLocked()')
    assert.include(repository, "distinctOn('userId')")
    assert.include(repository, 'IS DISTINCT FROM')
    assert.include(service, 'synchronizeAllUserBalances')
    assert.include(service, 'synchronizeUserBalance')
    assert.include(
      service,
      'if (!result.transaction && (await this.synchronizeUserBalance(userId)))'
    )
  })

  test('runs reconciliation as an idempotent, off-request maintenance job', async ({ assert }) => {
    const job = await readProjectFile('app/jobs/sync_credit_balances.ts')
    const scheduler = await readProjectFile('start/scheduler.ts')
    const command = await readProjectFile('commands/sync_credit_balances.ts')

    assert.include(job, "queue: 'maintenance'")
    assert.include(job, 'maxRetries: 3')
    assert.include(scheduler, "id('maintenance-sync-credit-balances')")
    assert.include(scheduler, ".cron('15 3 * * *')")
    assert.include(scheduler, ".timezone('Asia/Jakarta')")
    assert.include(scheduler, "env.get('QUEUE_DRIVER') === 'redis'")
    assert.include(scheduler, "env.get('MCP_SERVER') !== 'true'")
    assert.include(command, "static commandName = 'credits:sync-balances'")
  })
})
