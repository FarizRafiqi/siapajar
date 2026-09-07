import { DateTime } from 'luxon'
import UsageEvent from '#models/usage_event'
import type User from '#models/user'
import { packageEntitlementRepository } from '#repositories/package_entitlement_repository'
import type { PackageEntitlementRepository } from '#repositories/package_entitlement_repository'
import { usageEventRepository } from '#repositories/usage_event_repository'
import type { UsageEventRepository } from '#repositories/usage_event_repository'

export class EntitlementError extends Error {
  status = 402
}

const FEATURE_LABELS: Record<string, string> = {
  classes: 'Kelas',
  ai_generation_monthly: 'Generate AI bulanan',
  ai_image_generation_monthly: 'Generate gambar AI bulanan',
  ai_svg_generation_monthly: 'Generate ilustrasi SVG bulanan',
  export_pdf: 'Export PDF',
  export_docx: 'Export DOCX',
  export_pptx: 'Export PPTX',
  export_xlsx: 'Export XLSX',
  custom_atp: 'ATP custom',
  custom_iktp: 'IKTP custom',
}

export function getFeatureLabel(featureKey: string) {
  return (
    FEATURE_LABELS[featureKey] ??
    featureKey.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
  )
}

export class EntitlementService {
  constructor(
    private readonly entitlements: PackageEntitlementRepository = packageEntitlementRepository,
    private readonly usageEvents: UsageEventRepository = usageEventRepository
  ) {}

  async assertEntitled(user: User, featureKey: string, amount = 1) {
    if (user.role === 'admin' || !user.packageId) return

    const entitlement = await this.entitlements.findForFeature(user.packageId, featureKey)
    // Package lama tetap kompatibel sampai admin mengisi entitlement secara eksplisit.
    if (!entitlement) return
    if (!entitlement.isEnabled) {
      throw new EntitlementError(
        `Fitur ${getFeatureLabel(featureKey)} tidak tersedia pada paket Anda`
      )
    }
    if (entitlement.limitValue === null) return

    const periodStart = DateTime.now().startOf('month').toISODate()!
    const total = await this.usageEvents.sumForFeaturePeriod(user.id, featureKey, periodStart)
    if (Number(total[0]?.total ?? 0) + amount > entitlement.limitValue) {
      throw new EntitlementError(
        `Batas fitur ${getFeatureLabel(featureKey)} pada paket Anda sudah tercapai`
      )
    }
  }

  async recordUsage(
    userId: number,
    featureKey: string,
    quantity = 1,
    metadata: Record<string, unknown> = {}
  ) {
    const periodStart = DateTime.now().startOf('month')
    await UsageEvent.create({ userId, eventKey: featureKey, quantity, periodStart, metadata })
  }

  /** Reserve quota atomically. Existing reservation key makes operation idempotent. */
  async reserveUsage(
    user: User,
    featureKey: string,
    reservationKey: string,
    quantity = 1,
    metadata: Record<string, unknown> = {}
  ) {
    const periodStart = DateTime.now().startOf('month').toISODate()!

    return this.usageEvents.reserveUsage(
      {
        userId: user.id,
        role: user.role,
        packageId: user.packageId,
        featureKey,
        reservationKey,
        quantity,
        periodStart,
        metadata,
      },
      ({ entitlement, used }) => {
        if (!entitlement) return
        if (!entitlement.is_enabled) {
          throw new EntitlementError(
            `Fitur ${getFeatureLabel(featureKey)} tidak tersedia pada paket Anda`
          )
        }
        if (
          entitlement.limit_value !== null &&
          entitlement.limit_value !== undefined &&
          used + quantity > Number(entitlement.limit_value)
        ) {
          throw new EntitlementError(
            `Batas fitur ${getFeatureLabel(featureKey)} pada paket Anda sudah tercapai`
          )
        }
      }
    )
  }

  async commitUsageReservation(reservationKey: string) {
    const event = await UsageEvent.findBy('reservationKey', reservationKey)
    if (!event) return
    event.metadata = { ...event.metadata, status: 'committed' }
    await event.save()
  }

  async releaseUsageReservation(reservationKey: string) {
    await UsageEvent.query().where('reservationKey', reservationKey).delete()
  }
}

export const entitlementService = new EntitlementService()

export const assertEntitled = entitlementService.assertEntitled.bind(entitlementService)
export const recordUsage = entitlementService.recordUsage.bind(entitlementService)
export const reserveUsage = entitlementService.reserveUsage.bind(entitlementService)
export const commitUsageReservation =
  entitlementService.commitUsageReservation.bind(entitlementService)
export const releaseUsageReservation =
  entitlementService.releaseUsageReservation.bind(entitlementService)
