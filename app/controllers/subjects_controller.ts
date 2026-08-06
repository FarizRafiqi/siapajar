import type { HttpContext } from '@adonisjs/core/http'
import Subject from '#models/subject'
import { createSubjectValidator, updateSubjectValidator } from '#validators/subject'

/**
 * Mata pelajaran default per jenjang.
 *
 * TK memakai 3 elemen Capaian Pembelajaran Fase Fondasi Kurikulum Merdeka —
 * bukan aspek perkembangan K-13 lama (motorik/kognitif/bahasa).
 */
export const DEFAULT_SUBJECTS: Record<'tk' | 'sd', string[]> = {
  tk: [
    'Nilai Agama dan Budi Pekerti',
    'Jati Diri',
    'Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
  ],
  sd: [
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'PPKn',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
    'Muatan Lokal',
  ],
}

export default class SubjectsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const subjects = await Subject.query()
      .where('user_id', user.id)
      .where('education_level', user.educationLevel || 'sd')
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')

    return inertia.render('dashboard/subjects/index', {
      subjects: subjects.map((s) => s.toJSON()),
      educationLevel: user.educationLevel,
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createSubjectValidator)

    const duplicate = await Subject.query()
      .where('user_id', user.id)
      .where('name', data.name)
      .where('education_level', data.educationLevel)
      .first()

    if (duplicate) {
      session.flash('error', `Mata pelajaran "${data.name}" sudah ada`)
      return response.redirect().back()
    }

    await Subject.create({
      ...data,
      userId: user.id,
    })

    session.flash('success', 'Mata pelajaran berhasil ditambahkan')
    return response.redirect().back()
  }

  /**
   * Tambah mata pelajaran default sesuai jenjang dalam satu request.
   * Menggantikan loop router.post di frontend yang saling membatalkan.
   */
  async storeDefaults({ response, session, auth }: HttpContext) {
    const user = auth.user!
    const educationLevel = (user.educationLevel || 'sd') as 'tk' | 'sd'

    const defaults = DEFAULT_SUBJECTS[educationLevel]

    for (const name of defaults) {
      await Subject.updateOrCreate(
        { userId: user.id, name, educationLevel },
        { userId: user.id, name, educationLevel, gradeLevel: null, isActive: true }
      )
    }

    session.flash('success', `${defaults.length} mata pelajaran default berhasil ditambahkan`)
    return response.redirect().back()
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const user = auth.user!
    const subject = await Subject.query().where('id', params.id).where('user_id', user.id).first()

    if (!subject) {
      return response.redirect('/subjects')
    }

    const data = await request.validateUsing(updateSubjectValidator)
    await subject.merge(data).save()

    session.flash('success', 'Mata pelajaran berhasil diupdate')
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const subject = await Subject.query().where('id', params.id).where('user_id', user.id).first()

    if (!subject) {
      return response.redirect('/subjects')
    }

    await subject.delete()

    session.flash('success', 'Mata pelajaran berhasil dihapus')
    return response.redirect().back()
  }
}
