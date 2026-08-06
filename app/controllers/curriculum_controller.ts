import type { HttpContext } from '@adonisjs/core/http'
import CurriculumCp from '#models/curriculum_cp'
import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'
import IktpIndicator from '#models/iktp_indicator'
import {
  createIndicatorValidator,
  createObjectiveValidator,
  createSequenceValidator,
  updateSequenceValidator,
} from '#validators/curriculum'
import { assertEntitled, recordUsage } from '#services/entitlement_service'
import { exportCurriculum } from '#services/export_service'
import { exportCurriculumPdf } from '#services/pdf_export_service'
import {
  EXPORT_CONTENT_TYPES,
  exportFilename,
  sendExport,
  wantsInlinePreview,
} from '#services/export_file_service'

export default class CurriculumController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const cps = await CurriculumCp.query()
      .preload('learningObjectives', (query) => {
        query.where((q) => q.whereNull('user_id').orWhere('user_id', user.id)).preload('indicators')
      })
      .orderBy('id')
    const sequences = await LearningSequence.query()
      .where('user_id', user.id)
      .orderBy('updated_at', 'desc')
    return inertia.render('dashboard/curriculum/index', {
      cps: cps.map((cp) => cp.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
      profile: {
        educationLevel: user.educationLevel,
        institutionType: user.institutionType,
        curriculumVersion: user.curriculumVersion,
        defaultGroupContext: user.defaultGroupContext,
      },
    })
  }

  async export({ response, auth }: HttpContext) {
    const user = auth.user!
    const { cps, sequences } = await this.exportData(user.id)
    const buffer = await exportCurriculum(cps, sequences, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.docx,
      exportFilename(
        ['Kurikulum', user.institutionType?.toUpperCase() || user.educationLevel],
        'docx'
      )
    )
  }

  async exportPdf({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { cps, sequences } = await this.exportData(user.id)
    const buffer = await exportCurriculumPdf(cps, sequences, user)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(
        ['Kurikulum', user.institutionType?.toUpperCase() || user.educationLevel],
        'pdf'
      ),
      { inline: wantsInlinePreview(request) }
    )
  }

  async storeObjective({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createObjectiveValidator)
    await assertEntitled(user, 'custom_atp')
    const cp = await CurriculumCp.find(data.cpId)
    if (!cp) {
      session.flash('error', 'CP tidak ditemukan')
      return response.redirect().back()
    }
    await LearningObjective.create({ ...data, userId: user.id, source: 'custom' })
    await recordUsage(user.id, 'custom_atp')
    session.flash('success', 'TP berhasil dibuat')
    return response.redirect().back()
  }

  async storeSequence({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSequenceValidator)
    await this.assertObjectivesOwned(
      data.items?.map((item) => item.learningObjectiveId) ?? [],
      user.id
    )
    await LearningSequence.create({
      ...data,
      userId: user.id,
      schoolId: user.schoolId,
      curriculumVersion: data.curriculumVersion ?? user.curriculumVersion ?? 'Kurikulum Merdeka',
      items: data.items ?? [],
      status: 'draft',
    })
    session.flash('success', 'ATP berhasil disimpan sebagai draft')
    return response.redirect().back()
  }

  async updateSequence({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const sequence = await LearningSequence.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()
    if (!sequence) return response.redirect('/curriculum')
    const data = await request.validateUsing(updateSequenceValidator)
    if (data.items)
      await this.assertObjectivesOwned(
        data.items.map((item) => item.learningObjectiveId),
        user.id
      )
    await sequence.merge(data).save()
    session.flash('success', 'ATP berhasil diperbarui')
    return response.redirect().back()
  }

  async storeIndicator({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createIndicatorValidator)
    await assertEntitled(user, 'custom_iktp')
    const objective = await LearningObjective.query()
      .where('id', data.learningObjectiveId)
      .where((q) => q.whereNull('user_id').orWhere('user_id', user.id))
      .first()
    if (!objective) {
      session.flash('error', 'TP tidak ditemukan')
      return response.redirect().back()
    }
    await IktpIndicator.create({ ...data, userId: user.id })
    await recordUsage(user.id, 'custom_iktp')
    session.flash('success', 'IKTP berhasil ditambahkan')
    return response.redirect().back()
  }

  private async assertObjectivesOwned(ids: number[], userId: number) {
    if (ids.length === 0) return
    const count = await LearningObjective.query()
      .whereIn('id', ids)
      .where((q) => q.whereNull('user_id').orWhere('user_id', userId))
      .count('* as total')
    if (Number(count[0].$extras.total) !== new Set(ids).size)
      throw new Error('TP tidak valid atau bukan milik pengguna')
  }

  private async exportData(userId: number) {
    const cps = await CurriculumCp.query()
      .preload('learningObjectives', (query) => {
        query.where((q) => q.whereNull('user_id').orWhere('user_id', userId)).preload('indicators')
      })
      .orderBy('id')
    const sequences = await LearningSequence.query()
      .where('user_id', userId)
      .orderBy('updated_at', 'desc')
    return {
      cps: cps.map((cp) => cp.toJSON()),
      sequences: sequences.map((sequence) => sequence.toJSON()),
    }
  }
}
