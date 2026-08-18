import type { HttpContext } from '@adonisjs/core/http'
import CurriculumPreset from '#models/curriculum_preset'
import {
  createCurriculumPresetValidator,
  updateCurriculumPresetValidator,
} from '#validators/admin_curriculum_preset'
import { MASTER_KBC_PRESETS } from '#database/seeders/curriculum_preset_seeder'

export default class AdminCurriculumPresetsController {
  async index({ inertia, request }: HttpContext) {
    const level = request.input('level', 'tk')
    const semester = Number(request.input('semester', '1'))

    const query = CurriculumPreset.query()
      .where('education_level', level)
      .where('semester', semester)
      .orderBy('sort_order', 'asc')
      .orderBy('week_number', 'asc')

    const presets = await query

    return inertia.render('dashboard/admin/curriculum-presets/index', {
      presets: presets.map((p) => p.toJSON()),
      activeLevel: level,
      activeSemester: semester,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createCurriculumPresetValidator)
    const existing = await CurriculumPreset.findBy('code', payload.code)
    if (existing) {
      session.flash('error', `Kode preset "${payload.code}" sudah digunakan.`)
      return response.redirect().back()
    }

    await CurriculumPreset.create({
      educationLevel: payload.educationLevel,
      curriculumVersion: payload.curriculumVersion,
      semester: payload.semester,
      weekNumber: payload.weekNumber ?? null,
      code: payload.code,
      themeTitle: payload.themeTitle,
      subthemeTitle: payload.subthemeTitle ?? null,
      phase: payload.phase,
      groupContext: payload.groupContext ?? null,
      data: {
        description: payload.description,
        dpl: payload.dpl,
        kbcValues: payload.kbcValues,
        loosePartsSuggestions: payload.loosePartsSuggestions,
      },
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? payload.weekNumber ?? 1,
    })

    session.flash('success', 'Tema preset kurikulum berhasil ditambahkan.')
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const preset = await CurriculumPreset.findOrFail(params.id)
    const payload = await request.validateUsing(updateCurriculumPresetValidator)

    if (payload.educationLevel !== undefined) preset.educationLevel = payload.educationLevel
    if (payload.curriculumVersion !== undefined)
      preset.curriculumVersion = payload.curriculumVersion
    if (payload.semester !== undefined) preset.semester = payload.semester
    if (payload.weekNumber !== undefined) preset.weekNumber = payload.weekNumber
    if (payload.code !== undefined) preset.code = payload.code
    if (payload.themeTitle !== undefined) preset.themeTitle = payload.themeTitle
    if (payload.subthemeTitle !== undefined) preset.subthemeTitle = payload.subthemeTitle
    if (payload.phase !== undefined) preset.phase = payload.phase
    if (payload.groupContext !== undefined) preset.groupContext = payload.groupContext
    if (payload.isActive !== undefined) preset.isActive = payload.isActive
    if (payload.sortOrder !== undefined) preset.sortOrder = payload.sortOrder

    const existingData = preset.data || {}
    preset.data = {
      ...existingData,
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.dpl !== undefined ? { dpl: payload.dpl } : {}),
      ...(payload.kbcValues !== undefined ? { kbcValues: payload.kbcValues } : {}),
      ...(payload.loosePartsSuggestions !== undefined
        ? { loosePartsSuggestions: payload.loosePartsSuggestions }
        : {}),
    }

    await preset.save()
    session.flash('success', 'Tema preset kurikulum berhasil diperbarui.')
    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const preset = await CurriculumPreset.findOrFail(params.id)
    await preset.delete()
    session.flash('success', 'Tema preset kurikulum berhasil dihapus.')
    return response.redirect().back()
  }

  async resetDefaults({ response, session }: HttpContext) {
    for (const item of MASTER_KBC_PRESETS) {
      await CurriculumPreset.updateOrCreate(
        { code: item.code },
        {
          educationLevel: 'tk',
          curriculumVersion: 'KBC RA',
          semester: item.semester,
          weekNumber: item.weekNumber,
          code: item.code,
          themeTitle: item.themeTitle,
          subthemeTitle: item.subthemeTitle,
          phase: 'Fondasi',
          groupContext: item.groupContext,
          data: {
            description: item.description,
            dpl: item.dpl,
            kbcValues: item.kbcValues,
            loosePartsSuggestions: item.looseParts,
          },
          isActive: true,
          sortOrder: item.weekNumber,
        }
      )
    }
    session.flash('success', 'Tema preset kurikulum berhasil direset ke standar resmi 18 pekan.')
    return response.redirect().back()
  }
}
