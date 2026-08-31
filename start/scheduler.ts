/**
 * Scheduler preload for the official AdonisJS queue package.
 * Recurring jobs can be registered here as the product adds scheduled exports
 * or usage rollups; no external process is required to configure them.
 */

import env from '#start/env'
import SyncCreditBalances from '#jobs/sync_credit_balances'

/**
 * Reconcile the denormalized balance once per day in a maintenance queue.
 * The stable ID makes registration idempotent when both web and worker
 * processes boot at the same time.
 */
if (
  env.get('NODE_ENV') !== 'test' &&
  env.get('QUEUE_DRIVER') === 'redis' &&
  env.get('MCP_SERVER') !== 'true'
) {
  void SyncCreditBalances.schedule({ batchSize: 250 })
    .id('maintenance-sync-credit-balances')
    .cron('15 3 * * *')
    .timezone('Asia/Jakarta')
    .run()
    .catch((error: unknown) => {
      console.error(
        'Failed to register the credit balance maintenance schedule:',
        error instanceof Error ? error.message : error
      )
    })
}
