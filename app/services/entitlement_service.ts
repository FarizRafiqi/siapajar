import { DateTime } from 'luxon'
import PackageEntitlement from '#models/package_entitlement'
import UsageEvent from '#models/usage_event'
import type User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export class EntitlementError extends Error {
  status = 402
}

export async function assertEntitled(user: User, featureKey: string, amount = 1) {
  if (user.role === 'admin' || !user.packageId) return
  const entitlement = await PackageEntitlement.query()
    .where('package_id', user.packageId)
    .where('feature_key', featureKey)
    .first()
  // Package lama tetap kompatibel sampai admin mengisi entitlement secara eksplisit.
  if (!entitlement) return
  if (!entitlement.isEnabled)
    throw new EntitlementError(`Fitur ${featureKey} tidak tersedia pada paket Anda`)
  if (entitlement.limitValue === null) return
  const periodStart = DateTime.now().startOf('month')
  const total = await UsageEvent.query()
    .where('user_id', user.id)
    .where('event_key', featureKey)
    .where('period_start', periodStart.toISODate()!)
    .sum('quantity as total')
  if (Number(total[0].$extras.total ?? 0) + amount > entitlement.limitValue) {
    throw new EntitlementError(`Batas fitur ${featureKey} pada paket Anda sudah tercapai`)
  }
}

export async function recordUsage(
  userId: number,
  featureKey: string,
  quantity = 1,
  metadata: Record<string, unknown> = {}
) {
  const periodStart = DateTime.now().startOf('month')
  await UsageEvent.create({ userId, eventKey: featureKey, quantity, periodStart, metadata })
}

/** Reserve quota atomically. Existing reservation key makes operation idempotent. */
export async function reserveUsage(
  user: User,
  featureKey: string,
  reservationKey: string,
  quantity = 1,
  metadata: Record<string, unknown> = {}
) {
  return db.transaction(async (trx) => {
    await trx.from('users').where('id', user.id).forUpdate().firstOrFail()
    const existing = await trx.from('usage_events').where('reservation_key', reservationKey).first()
    if (existing) return false

    if (user.role !== 'admin' && user.packageId) {
      const entitlement = await trx
        .from('package_entitlements')
        .where('package_id', user.packageId)
        .where('feature_key', featureKey)
        .first()
      if (entitlement && !entitlement.is_enabled) {
        throw new EntitlementError(`Fitur ${featureKey} tidak tersedia pada paket Anda`)
      }
      if (entitlement?.limit_value !== null && entitlement?.limit_value !== undefined) {
        const periodStart = DateTime.now().startOf('month').toISODate()!
        const total = await trx
          .from('usage_events')
          .where('user_id', user.id)
          .where('event_key', featureKey)
          .where('period_start', periodStart)
          .sum('quantity as total')
        if (Number(total[0]?.total ?? 0) + quantity > Number(entitlement.limit_value)) {
          throw new EntitlementError(`Batas fitur ${featureKey} pada paket Anda sudah tercapai`)
        }
      }
    }

    await trx.table('usage_events').insert({
      user_id: user.id,
      event_key: featureKey,
      quantity,
      period_start: DateTime.now().startOf('month').toISODate(),
      reservation_key: reservationKey,
      metadata: JSON.stringify({ ...metadata, status: 'reserved' }),
      created_at: DateTime.now().toJSDate(),
      updated_at: DateTime.now().toJSDate(),
    })
    return true
  })
}

export async function commitUsageReservation(reservationKey: string) {
  const event = await UsageEvent.findBy('reservationKey', reservationKey)
  if (!event) return
  event.metadata = { ...event.metadata, status: 'committed' }
  await event.save()
}

export async function releaseUsageReservation(reservationKey: string) {
  await UsageEvent.query().where('reservationKey', reservationKey).delete()
}
