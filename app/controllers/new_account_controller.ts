import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import Package from '#models/package'
import PackageSubscription from '#models/package_subscription'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    const freePackage = await Package.findBy('name', 'free')
    const user = await User.create({ ...payload, packageId: freePackage?.id ?? null })
    if (freePackage) {
      await PackageSubscription.create({
        userId: user.id,
        packageId: freePackage.id,
        status: 'active',
        billingCycle: 'manual',
        startsAt: user.createdAt,
        endsAt: null,
        canceledAt: null,
        metadata: { source: 'signup' },
      })
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
