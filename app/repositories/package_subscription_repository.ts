import PackageSubscription from '#models/package_subscription'
import { DateTime } from 'luxon'

export class PackageSubscriptionRepository {
  async findActiveForUser(
    userId: number,
    now = DateTime.now(),
    options: { preloadPackage?: boolean } = {}
  ) {
    const query = PackageSubscription.query()
      .where('user_id', userId)
      .where('status', 'active')
      .where((builder) => builder.whereNull('ends_at').orWhere('ends_at', '>', now.toSQL()))
      .orderBy('starts_at', 'desc')

    if (options.preloadPackage) query.preload('package')

    return query.first()
  }

  async paginateForUser(userId: number, page: number, perPage: number) {
    return PackageSubscription.query()
      .where('user_id', userId)
      .preload('package')
      .orderBy('starts_at', 'desc')
      .paginate(page, perPage)
  }

  async listForUser(userId: number) {
    return PackageSubscription.query()
      .where('user_id', userId)
      .preload('package')
      .orderBy('starts_at', 'desc')
  }
}

export const packageSubscriptionRepository = new PackageSubscriptionRepository()
