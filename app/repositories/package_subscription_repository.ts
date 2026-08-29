import PackageSubscription from '#models/package_subscription'
import { DateTime } from 'luxon'

export class PackageSubscriptionRepository {
  async findActiveForUser(userId: number, now = DateTime.now()) {
    return PackageSubscription.query()
      .where('user_id', userId)
      .where('status', 'active')
      .where((query) => query.whereNull('ends_at').orWhere('ends_at', '>', now.toSQL()))
      .orderBy('starts_at', 'desc')
      .first()
  }
}

export const packageSubscriptionRepository = new PackageSubscriptionRepository()
