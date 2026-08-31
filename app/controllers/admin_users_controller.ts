import type { HttpContext } from '@adonisjs/core/http'
import { updateUserRoleValidator } from '#validators/admin'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminUsersController {
  async index({ inertia }: HttpContext) {
    return inertia.render('dashboard/admin/users/index', await adminCatalogService.listUsers())
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const currentUser = auth.user!
    const data = await request.validateUsing(updateUserRoleValidator)
    const result = await adminCatalogService.updateUser(params.id, currentUser.id, data)
    if (result === 'not_found') return response.redirect('/admin/users')
    if (result === 'self') {
      session.flash('error', 'Tidak bisa mengubah role akun sendiri')
      return response.redirect().back()
    }

    session.flash('success', 'User berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const currentUser = auth.user!
    const result = await adminCatalogService.deleteUser(params.id, currentUser.id)
    if (result === 'not_found') return response.redirect('/admin/users')
    if (result === 'self') {
      session.flash('error', 'Tidak bisa menghapus akun sendiri')
      return response.redirect().back()
    }

    session.flash('success', 'User berhasil dihapus')
    return response.redirect().toRoute('admin.users.index')
  }
}
