import db from '@adonisjs/lucid/services/db'

export type UsageEntitlementSnapshot = {
  is_enabled: boolean
  limit_value: number | string | null
} | null

export type UsageReservationValidation = (input: {
  entitlement: UsageEntitlementSnapshot
  used: number
}) => void

export type ReserveUsageParams = {
  userId: number
  role: string
  packageId: number | null
  featureKey: string
  reservationKey: string
  quantity: number
  periodStart: string
  metadata: Record<string, unknown>
}

export class UsageEventRepository {
  async summarizeForUserPeriod(userId: number, periodStart: string) {
    return db
      .from('usage_events')
      .where('user_id', userId)
      .where('period_start', periodStart)
      .select('event_key')
      .sum('quantity as total')
      .groupBy('event_key')
      .orderBy('event_key')
  }

  async sumForFeaturePeriod(userId: number, featureKey: string, periodStart: string) {
    return db
      .from('usage_events')
      .where('user_id', userId)
      .where('event_key', featureKey)
      .where('period_start', periodStart)
      .sum('quantity as total')
  }

  async reserveUsage(
    params: ReserveUsageParams,
    validate: UsageReservationValidation
  ): Promise<boolean> {
    return db.transaction(async (trx) => {
      await trx.from('users').where('id', params.userId).forUpdate().firstOrFail()

      const existing = await trx
        .from('usage_events')
        .where('reservation_key', params.reservationKey)
        .first()
      if (existing) return false

      if (params.role !== 'admin' && params.packageId) {
        const entitlement = (await trx
          .from('package_entitlements')
          .where('package_id', params.packageId)
          .where('feature_key', params.featureKey)
          .first()) as UsageEntitlementSnapshot

        let used = 0
        if (entitlement?.limit_value !== null && entitlement?.limit_value !== undefined) {
          const total = await trx
            .from('usage_events')
            .where('user_id', params.userId)
            .where('event_key', params.featureKey)
            .where('period_start', params.periodStart)
            .sum('quantity as total')
          used = Number(total[0]?.total ?? 0)
        }

        validate({ entitlement, used })
      }

      await trx.table('usage_events').insert({
        user_id: params.userId,
        event_key: params.featureKey,
        quantity: params.quantity,
        period_start: params.periodStart,
        reservation_key: params.reservationKey,
        metadata: JSON.stringify({ ...params.metadata, status: 'reserved' }),
        created_at: new Date(),
        updated_at: new Date(),
      })

      return true
    })
  }
}

export const usageEventRepository = new UsageEventRepository()
