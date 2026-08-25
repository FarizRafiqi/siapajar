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
import { PAUD_CURRICULUM_PRESETS } from '#services/curriculum_presets'
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
        ['Matriks_CP_TP_ATP', (user as any).institutionName || user.schoolName || 'Sekolah'],
        'docx'
      )
    )
  }

  async exportPdf({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { cps, sequences } = await this.exportData(user.id)
    const isInline = wantsInlinePreview(request)
    const buffer = await exportCurriculumPdf(cps, sequences, user, !isInline)
    return sendExport(
      response,
      buffer,
      EXPORT_CONTENT_TYPES.pdf,
      exportFilename(
        ['Matriks_CP_TP_ATP', (user as any).institutionName || user.schoolName || 'Sekolah'],
        'pdf'
      ),
      { inline: isInline }
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

  async destroyObjective({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const objective = await LearningObjective.query()
      .where('id', params.id)
      .where((q) => {
        if (user.role === 'admin') {
          // admin can delete any
        } else {
          q.where('user_id', user.id).orWhereNull('user_id')
        }
      })
      .first()

    if (objective) {
      await IktpIndicator.query().where('learning_objective_id', objective.id).delete()
      await objective.delete()
      session.flash('success', 'Tujuan Pembelajaran (TP) berhasil dihapus')
    } else {
      session.flash('error', 'Tujuan Pembelajaran tidak ditemukan')
    }

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

  async destroySequence({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const sequence = await LearningSequence.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (sequence) {
      await sequence.delete()
      session.flash('success', 'Alur ATP berhasil dihapus')
    }
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

  private async ensureBaseCps(presetCps: typeof PAUD_CURRICULUM_PRESETS.cps) {
    const cps = await CurriculumCp.query().orderBy('id')
    if (cps.length === 0) {
      for (const cpData of presetCps) {
        await CurriculumCp.create({
          code: cpData.code,
          element: cpData.element,
          title: cpData.title,
          description: cpData.description,
        })
      }
    }
    return CurriculumCp.query().orderBy('id')
  }

  private async seedObjectivesForCp(
    cpData: (typeof PAUD_CURRICULUM_PRESETS.cps)[number],
    targetCpId: number,
    userId: number
  ) {
    const createdObjectiveIds: number[] = []

    for (const objData of cpData.objectives) {
      let objective = await LearningObjective.query()
        .where('code', objData.code)
        .where((q) => q.whereNull('user_id').orWhere('user_id', userId))
        .first()

      objective ??= await LearningObjective.create({
        cpId: targetCpId,
        code: objData.code,
        title: objData.title,
        groupContext: objData.groupContext || 'a',
        userId: userId,
        source: 'custom',
      })
      createdObjectiveIds.push(objective.id)

      for (const indData of objData.indicators) {
        const existingIndicator = await IktpIndicator.query()
          .where('learning_objective_id', objective.id)
          .where('description', indData.description)
          .first()

        if (!existingIndicator) {
          await IktpIndicator.create({
            learningObjectiveId: objective.id,
            description: indData.description,
            evidenceType: indData.evidenceType,
            achievementCriteria: indData.achievementCriteria,
            userId: userId,
          })
        }
      }
    }

    return createdObjectiveIds
  }

  async seedPresets({ response, session, auth }: HttpContext) {
    const user = auth.user!
    const preset = PAUD_CURRICULUM_PRESETS

    const currentCps = await this.ensureBaseCps(preset.cps)
    const createdObjectiveIds: number[] = []

    for (const cpData of preset.cps) {
      const targetCp = currentCps.find((c) => c.code === cpData.code) || currentCps[0]
      if (!targetCp) continue

      const ids = await this.seedObjectivesForCp(cpData, targetCp.id, user.id)
      createdObjectiveIds.push(...ids)
    }

    const existingSeq = await LearningSequence.query()
      .where('user_id', user.id)
      .where('title', preset.sequence.title)
      .first()

    if (!existingSeq && createdObjectiveIds.length > 0) {
      await LearningSequence.create({
        userId: user.id,
        schoolId: user.schoolId,
        title: preset.sequence.title,
        educationLevel: preset.sequence.educationLevel,
        groupContext: preset.sequence.groupContext || 'a',
        curriculumVersion: 'Kurikulum Merdeka',
        status: 'draft',
        items: createdObjectiveIds.map((id, index) => ({
          learningObjectiveId: id,
          order: index + 1,
        })),
      })
    }

    session.flash('success', 'Contoh ATP & IKTP siap pakai berhasil dimuat!')
    return response.redirect().back()
  }

  async resetPresets({ response, session, auth }: HttpContext) {
    const user = auth.user!

    await IktpIndicator.query().where('user_id', user.id).delete()
    await LearningSequence.query().where('user_id', user.id).delete()
    await LearningObjective.query().where('user_id', user.id).delete()

    session.flash('success', 'Data ATP & IKTP berhasil di-reset ke kondisi awal!')
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

    const allObjectives = await LearningObjective.query()
      .where((q) => q.whereNull('user_id').orWhere('user_id', userId))
      .preload('indicators')

    const objectiveMap = new Map(allObjectives.map((o) => [o.id, o.toJSON()]))

    const sequencesJson = sequences.map((seq) => {
      const json = seq.toJSON()
      json.items = (json.items || []).map((item: any) => {
        const obj = objectiveMap.get(item.learningObjectiveId)
        return {
          ...item,
          code: obj?.code || `TP-${item.learningObjectiveId}`,
          title: obj?.title || `Tujuan Pembelajaran #${item.learningObjectiveId}`,
          indicators: obj?.indicators || [],
        }
      })
      return json
    })

    return {
      cps: cps.map((cp) => cp.toJSON()),
      sequences: sequencesJson,
    }
  }
}
