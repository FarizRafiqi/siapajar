/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', '#controllers/home_controller.index').as('home')

router.get('/coming-soon', ({ inertia }) => {
  return inertia.render('coming-soon', {})
}).as('coming-soon')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    router.get('auth/google/redirect', '#controllers/google_auth_controller.redirect').as('auth.google.redirect')
    router.get('auth/google/callback', '#controllers/google_auth_controller.callback').as('auth.google.callback')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// Dashboard routes
router
  .group(() => {
    // Onboarding
    router.get('/onboarding', '#controllers/onboarding_controller.index').as('onboarding.index')
    router.post('/onboarding', '#controllers/onboarding_controller.store').as('onboarding.store')

    // Dashboard
    router.get('/dashboard', '#controllers/dashboard_controller.index').as('dashboard')

    // Classes (Kelas)
    router.get('/classes', '#controllers/classes_controller.index').as('classes.index')
    router.post('/classes', '#controllers/classes_controller.store').as('classes.store')
    router.get('/classes/:id', '#controllers/classes_controller.show').as('classes.show')
    router.put('/classes/:id', '#controllers/classes_controller.update').as('classes.update')
    router.delete('/classes/:id', '#controllers/classes_controller.destroy').as('classes.destroy')
    router.post('/classes/:id/students', '#controllers/classes_controller.addStudent').as('classes.addStudent')
    router.post('/classes/:id/students/import', '#controllers/classes_controller.importStudents').as('classes.importStudents')
    router.put('/classes/:id/students/:studentId', '#controllers/classes_controller.updateStudent').as('classes.updateStudent')
    router.delete('/classes/:id/students/:studentId', '#controllers/classes_controller.removeStudent').as('classes.removeStudent')

    // Teaching Modules (Modul Ajar)
    router.get('/teaching-modules', '#controllers/teaching_modules_controller.index').as('teaching-modules.index')
    router.post('/teaching-modules', '#controllers/teaching_modules_controller.store').as('teaching-modules.store')
    router.get('/teaching-modules/:id', '#controllers/teaching_modules_controller.show').as('teaching-modules.show')
    router.put('/teaching-modules/:id', '#controllers/teaching_modules_controller.update').as('teaching-modules.update')
    router.delete('/teaching-modules/:id', '#controllers/teaching_modules_controller.destroy').as('teaching-modules.destroy')
    router.post('/teaching-modules/generate', '#controllers/teaching_modules_controller.generate').as('teaching-modules.generate')
    router.get('/teaching-modules/:id/export', '#controllers/teaching_modules_controller.export').as('teaching-modules.export')
    router.get('/teaching-modules/:id/export/pdf', '#controllers/teaching_modules_controller.exportPdf').as('teaching-modules.exportPdf')

    // Exams (Soal)
    router.get('/exams', '#controllers/exams_controller.index').as('exams.index')
    router.post('/exams', '#controllers/exams_controller.store').as('exams.store')
    router.get('/exams/:id', '#controllers/exams_controller.show').as('exams.show')
    router.put('/exams/:id', '#controllers/exams_controller.update').as('exams.update')
    router.delete('/exams/:id', '#controllers/exams_controller.destroy').as('exams.destroy')
    router.post('/exams/generate', '#controllers/exams_controller.generate').as('exams.generate')
    router.get('/exams/:id/export', '#controllers/exams_controller.export').as('exams.export')
    router.get('/exams/:id/export/pdf', '#controllers/exams_controller.exportPdf').as('exams.exportPdf')

    // Annual Plans (Protah)
    router.get('/annual-plans', '#controllers/annual_plans_controller.index').as('annual-plans.index')
    router.post('/annual-plans', '#controllers/annual_plans_controller.store').as('annual-plans.store')
    router.get('/annual-plans/:id', '#controllers/annual_plans_controller.show').as('annual-plans.show')
    router.put('/annual-plans/:id', '#controllers/annual_plans_controller.update').as('annual-plans.update')
    router.delete('/annual-plans/:id', '#controllers/annual_plans_controller.destroy').as('annual-plans.destroy')
    router.post('/annual-plans/generate', '#controllers/annual_plans_controller.generate').as('annual-plans.generate')
    router.get('/annual-plans/:id/export', '#controllers/annual_plans_controller.export').as('annual-plans.export')
    router.get('/annual-plans/:id/export/pdf', '#controllers/annual_plans_controller.exportPdf').as('annual-plans.exportPdf')

    // Semester Plans (Promes)
    router.get('/semester-plans', '#controllers/semester_plans_controller.index').as('semester-plans.index')
    router.post('/semester-plans', '#controllers/semester_plans_controller.store').as('semester-plans.store')
    router.get('/semester-plans/:id', '#controllers/semester_plans_controller.show').as('semester-plans.show')
    router.put('/semester-plans/:id', '#controllers/semester_plans_controller.update').as('semester-plans.update')
    router.delete('/semester-plans/:id', '#controllers/semester_plans_controller.destroy').as('semester-plans.destroy')
    router.post('/semester-plans/generate', '#controllers/semester_plans_controller.generate').as('semester-plans.generate')
    router.get('/semester-plans/:id/export', '#controllers/semester_plans_controller.export').as('semester-plans.export')
    router.get('/semester-plans/:id/export/pdf', '#controllers/semester_plans_controller.exportPdf').as('semester-plans.exportPdf')

    // RPPM (rencana mingguan TK/PAUD)
    router.get('/rppm', '#controllers/weekly_lesson_plans_controller.index').as('rppm.index')
    router.get('/rppm/:id', '#controllers/weekly_lesson_plans_controller.show').as('rppm.show')
    router.put('/rppm/:id', '#controllers/weekly_lesson_plans_controller.update').as('rppm.update')
    router.delete('/rppm/:id', '#controllers/weekly_lesson_plans_controller.destroy').as('rppm.destroy')
    router.post('/rppm/generate', '#controllers/weekly_lesson_plans_controller.generate').as('rppm.generate')

    // RPPH (rencana harian TK/PAUD)
    router.get('/rpph', '#controllers/daily_lesson_plans_controller.index').as('rpph.index')
    router.get('/rpph/:id', '#controllers/daily_lesson_plans_controller.show').as('rpph.show')
    router.put('/rpph/:id', '#controllers/daily_lesson_plans_controller.update').as('rpph.update')
    router.delete('/rpph/:id', '#controllers/daily_lesson_plans_controller.destroy').as('rpph.destroy')
    router.post('/rpph/generate', '#controllers/daily_lesson_plans_controller.generate').as('rpph.generate')

    // LKPD (Lembar Kerja Peserta Didik / Lembar Aktivitas Anak)
    router.get('/lkpd', '#controllers/lkpds_controller.index').as('lkpd.index')
    router.get('/lkpd/:id', '#controllers/lkpds_controller.show').as('lkpd.show')
    router.delete('/lkpd/:id', '#controllers/lkpds_controller.destroy').as('lkpd.destroy')
    router.post('/lkpd/generate', '#controllers/lkpds_controller.generate').as('lkpd.generate')

    // Media Ajar (Outline Slide & Loose Parts Guide)
    router.get('/media-modules', '#controllers/media_modules_controller.index').as('media-modules.index')
    router.get('/media-modules/:id', '#controllers/media_modules_controller.show').as('media-modules.show')
    router.delete('/media-modules/:id', '#controllers/media_modules_controller.destroy').as('media-modules.destroy')
    router.post('/media-modules/generate', '#controllers/media_modules_controller.generate').as('media-modules.generate')

    // Asesmen PAUD (ceklis, catatan anekdot, hasil karya, foto berseri)
    router.get('/paud-assessments', '#controllers/paud_assessments_controller.index').as('paud-assessments.index')
    router.post('/paud-assessments', '#controllers/paud_assessments_controller.store').as('paud-assessments.store')
    router.put('/paud-assessments/:id', '#controllers/paud_assessments_controller.update').as('paud-assessments.update')
    router.delete('/paud-assessments/:id', '#controllers/paud_assessments_controller.destroy').as('paud-assessments.destroy')

    // Assessments (Penilaian & Nilai)
    router.get('/assessments', '#controllers/assessments_controller.index').as('assessments.index')
    router.post('/assessments', '#controllers/assessments_controller.store').as('assessments.store')
    router.get('/assessments/:id', '#controllers/assessments_controller.show').as('assessments.show')
    router.put('/assessments/:id/scores', '#controllers/assessments_controller.updateScores').as('assessments.updateScores')
    router.delete('/assessments/:id', '#controllers/assessments_controller.destroy').as('assessments.destroy')
    router.get('/assessments/:id/export', '#controllers/assessments_controller.export').as('assessments.export')

    // Kepala Sekolah — dashboard read-only
    router
      .get('/principal', '#controllers/principal_dashboard_controller.index')
      .as('principal.index')
      .use(middleware.role({ roles: ['kepala_sekolah'] }))
    router
      .get('/principal/teachers/:userId', '#controllers/principal_dashboard_controller.teacher')
      .as('principal.teacher')
      .use(middleware.role({ roles: ['kepala_sekolah'] }))

    // Rapor & Peringkat
    router.get('/report-cards', '#controllers/report_cards_controller.index').as('report-cards.index')
    router.get('/report-cards/:classId/:semesterId', '#controllers/report_cards_controller.show').as('report-cards.show')
    router.get('/report-cards/:classId/:semesterId/:studentId/export', '#controllers/report_cards_controller.exportPdf').as('report-cards.exportPdf')

    // Subjects (Mata Pelajaran)
    router.get('/subjects', '#controllers/subjects_controller.index').as('subjects.index')
    router.post('/subjects', '#controllers/subjects_controller.store').as('subjects.store')
    router.post('/subjects/defaults', '#controllers/subjects_controller.storeDefaults').as('subjects.storeDefaults')
    router.put('/subjects/:id', '#controllers/subjects_controller.update').as('subjects.update')
    router.delete('/subjects/:id', '#controllers/subjects_controller.destroy').as('subjects.destroy')

    // Settings (Pengaturan)
    router.get('/settings', '#controllers/settings_controller.index').as('settings.index')
    router.put('/settings', '#controllers/settings_controller.update').as('settings.update')

    // Admin — Manage Users
    router
      .get('/admin/users', '#controllers/admin_users_controller.index')
      .as('admin.users.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/users/:id', '#controllers/admin_users_controller.update')
      .as('admin.users.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/users/:id', '#controllers/admin_users_controller.destroy')
      .as('admin.users.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Manage Packages
    router
      .get('/admin/packages', '#controllers/admin_packages_controller.index')
      .as('admin.packages.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/packages', '#controllers/admin_packages_controller.store')
      .as('admin.packages.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/packages/:id', '#controllers/admin_packages_controller.update')
      .as('admin.packages.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/packages/:id', '#controllers/admin_packages_controller.destroy')
      .as('admin.packages.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Tahun Ajaran
    router
      .get('/admin/academic-years', '#controllers/admin_academic_years_controller.index')
      .as('admin.academic-years.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/academic-years', '#controllers/admin_academic_years_controller.store')
      .as('admin.academic-years.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/academic-years/:id', '#controllers/admin_academic_years_controller.update')
      .as('admin.academic-years.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/academic-years/:id', '#controllers/admin_academic_years_controller.destroy')
      .as('admin.academic-years.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Sekolah
    router
      .get('/admin/schools', '#controllers/admin_schools_controller.index')
      .as('admin.schools.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/schools', '#controllers/admin_schools_controller.store')
      .as('admin.schools.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/schools/:id', '#controllers/admin_schools_controller.update')
      .as('admin.schools.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/schools/:id', '#controllers/admin_schools_controller.destroy')
      .as('admin.schools.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Konfigurasi AI
    router
      .get('/admin/ai-settings', '#controllers/admin_ai_settings_controller.index')
      .as('admin.ai-settings.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/ai-settings', '#controllers/admin_ai_settings_controller.update')
      .as('admin.ai-settings.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/ai-settings/test', '#controllers/admin_ai_settings_controller.test')
      .as('admin.ai-settings.test')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/ai-settings/models', '#controllers/admin_ai_settings_controller.models')
      .as('admin.ai-settings.models')
      .use(middleware.role({ roles: ['admin'] }))
  })
  .use([middleware.auth(), middleware.onboarding()])
