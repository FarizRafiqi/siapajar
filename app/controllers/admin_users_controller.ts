import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Package from '#models/package'
import School from '#models/school'
import { updateUserRoleValidator } from '#validators/admin'

export default class AdminUsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query()
      .preload('package')
      .preload('school')
      .orderBy('created_at', 'desc')
    const packages = await Package.query().orderBy('sort_order', 'asc')
    const schools = await School.query().orderBy('name')

    return inertia.render('dashboard/admin/users/index', {
      users: users.map((u) => u.toJSON()),
      packages: packages.map((p) => p.toJSON()),
      schools: schools.map((s) => s.toJSON()),
    })
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const currentUser = auth.user!
    const user = await User.find(params.id)

    if (!user) {
      return response.redirect('/admin/users')
    }

    if (user.id === currentUser.id) {
      session.flash('error', 'Tidak bisa mengubah role akun sendiri')
      return response.redirect().back()
    }

    const data = await request.validateUsing(updateUserRoleValidator)
    user.merge(data)

    if (data.schoolId !== undefined) {
      const school = data.schoolId ? await School.find(data.schoolId) : null
      user.schoolName = school?.name ?? null
    }

    await user.save()

    session.flash('success', 'User berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const currentUser = auth.user!
    const user = await User.find(params.id)

    if (!user) {
      return response.redirect('/admin/users')
    }

    if (user.id === currentUser.id) {
      session.flash('error', 'Tidak bisa menghapus akun sendiri')
      return response.redirect().back()
    }

    await user.delete()

    session.flash('success', 'User berhasil dihapus')
    return response.redirect().toRoute('admin.users.index')
  }
}
