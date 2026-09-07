import type { HttpContext } from '@adonisjs/core/http'
import {
  createCurriculumPresetValidator,
  updateCurriculumPresetValidator,
} from '#validators/admin_curriculum_preset'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminCurriculumPresetsController {
  async index({ inertia, request }: HttpContext) {
    const level = request.input('level', 'tk')
    const semester = Number(request.input('semester', '1'))

    const presets = await adminCatalogService.listCurriculumPresets(level, semester)

    return inertia.render('dashboard/admin/curriculum-presets/index', {
      presets: presets.map((p) => p.toJSON()),
      activeLevel: level,
      activeSemester: semester,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCurriculumPresetValidator)
    const existing = await adminCatalogService.findCurriculumPresetByCode(payload.code)
    if (existing) {
      session.flash('error', `Kode preset "${payload.code}" sudah digunakan.`)
      return response.redirect().back()
    }

    await adminCatalogService.createCurriculumPreset(payload)

    session.flash('success', 'Tema preset kurikulum berhasil ditambahkan.')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updateCurriculumPresetValidator)
    await adminCatalogService.updateCurriculumPreset(params.id, payload)
    session.flash('success', 'Tema preset kurikulum berhasil diperbarui.')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    await adminCatalogService.deleteCurriculumPreset(params.id)
    session.flash('success', 'Tema preset kurikulum berhasil dihapus.')
    return response.redirect().back()
  }

  async resetDefaults({ response, session }: HttpContext) {
    await adminCatalogService.resetCurriculumPresets()
    session.flash('success', 'Tema preset kurikulum berhasil direset ke standar resmi 18 pekan.')
    return response.redirect().back()
  }
}
