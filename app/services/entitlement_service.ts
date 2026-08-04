import { DateTime } from 'luxon'
import PackageEntitlement from '#models/package_entitlement'
import UsageEvent from '#models/usage_event'
import User from '#models/user'

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
  if (!entitlement.isEnabled) throw new EntitlementError(`Fitur ${featureKey} tidak tersedia pada paket Anda`)
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
