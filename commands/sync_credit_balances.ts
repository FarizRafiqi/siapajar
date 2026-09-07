import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { creditService } from '#services/credit_service'

export default class SyncCreditBalancesCommand extends BaseCommand {
  static commandName = 'credits:sync-balances'
  static description = 'Reconcile cached user credit balances with the latest transactions'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const result = await creditService.synchronizeAllUserBalances({ batchSize: 250 })

    this.logger.success(
      `Credit balances synchronized: ${result.balancesUpdated} updated across ` +
        `${result.usersScanned} users in ${result.batchesProcessed} batch(es).`
    )
  }
}
