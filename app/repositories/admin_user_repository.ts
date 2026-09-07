import db from '@adonisjs/lucid/services/db'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'
import School from '#models/school'
import User from '#models/user'
import { DateTime } from 'luxon'

export class AdminUserRepository {
  async listForAdmin() {
    const [users, packages, schools] = await Promise.all([
      User.query().preload('package').preload('school').orderBy('created_at', 'desc'),
      Package.query().orderBy('sort_order', 'asc'),
      School.query().orderBy('name'),
    ])

    return { users, packages, schools }
  }

  async reassignPackage(user: User) {
    return db.transaction(async (trx) => {
      user.useTransaction(trx)
      await user.save()

      const now = DateTime.now()
      await PackageSubscription.query({ client: trx })
        .where('user_id', user.id)
        .where('status', 'active')
        .update({
          status: 'canceled',
          canceled_at: now.toSQL(),
          updated_at: now.toSQL(),
        })

      if (user.packageId) {
        const subscription = new PackageSubscription()
        subscription.useTransaction(trx)
        subscription.fill({
          userId: user.id,
          packageId: user.packageId,
          status: 'active',
          billingCycle: 'manual',
          startsAt: now,
          endsAt: null,
          canceledAt: null,
          metadata: { source: 'admin_assignment' },
        })
        await subscription.save()
      }

      return user
    })
  }
}

export const adminUserRepository = new AdminUserRepository()
