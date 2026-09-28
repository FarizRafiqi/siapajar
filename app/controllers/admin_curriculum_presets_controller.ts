import type { HttpContext } from '@adonisjs/core/http'
import {
  createCurriculumPresetValidator,
  updateCurriculumPresetValidator,
} from '#validators/admin_curriculum_preset'
import { adminCatalogService } from '#services/admin_catalog_service'

export default class AdminCurriculumPresetsController {
  async index({ inertia, request }: HttpContext) {
    const requestedLevel = request.input('level', 'tk')
    const level = ['tk', 'sd', 'smp', 'sma'].includes(requestedLevel) ? requestedLevel : 'tk'
    const requestedSemester = Number(request.input('semester', '1'))
    const semester = requestedSemester === 2 ? 2 : 1

    const presets = await adminCatalogService.listCurriculumPresets(level, semester)

    return inertia.render('dashboard/admin/curriculum-presets/index', {
      presets: presets.map((p) => p.toJSON()),
      activeLevel: level,
      activeSemester: semester,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(createCurriculumPresetValidator)
    const existing = await adminCatalogService.findCurriculumPresetByCode(payload.code)
    if (existing) {
      session.flash('error', `Kode preset "${payload.code}" sudah digunakan.`)
      return response.redirect().back()
    }

    await adminCatalogService.createCurriculumPreset(payload, auth.user!.id)

    session.flash('success', 'Tema preset kurikulum berhasil ditambahkan.')
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(updateCurriculumPresetValidator)
    if (payload.code) {
      const existing = await adminCatalogService.findCurriculumPresetByCode(payload.code, params.id)
      if (existing) {
        session.flash('error', `Kode preset "${payload.code}" sudah digunakan.`)
        return response.redirect().back()
      }
    }
    await adminCatalogService.updateCurriculumPreset(params.id, payload, auth.user!.id)
    session.flash('success', 'Tema preset kurikulum berhasil diperbarui.')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    await adminCatalogService.deleteCurriculumPreset(params.id, auth.user!.id)
    session.flash('success', 'Tema preset kurikulum berhasil dihapus.')
    return response.redirect().back()
  }

  async resetDefaults({ request, response, session, auth }: HttpContext) {
    const level = request.input('level', 'tk')
    if (level !== 'tk') {
      session.flash('error', 'Preset bawaan KBC RA saat ini hanya tersedia untuk jenjang TK / RA.')
      return response.redirect().back()
    }

    await adminCatalogService.resetCurriculumPresets(auth.user!.id)
    session.flash('success', 'Preset bawaan KBC RA berhasil dipulihkan untuk 18 pekan.')
    return response.redirect().back()
  }
}
