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
import db from '@adonisjs/lucid/services/db'

const ExpressToolsController = () => import('#controllers/express_tools_controller')
const MayarPaymentsController = () => import('#controllers/mayar_payments_controller')

router.get('/', [controllers.Home, 'index']).as('home')
router
  .get('/health', async ({ response }) => {
    try {
      const { default: redis } = await import('@adonisjs/redis/services/main')
      await db.rawQuery('select 1')
      await redis.ping()
      return response.ok({ status: 'ok', database: 'ok', redis: 'ok' })
    } catch {
      return response.serviceUnavailable({ status: 'degraded' })
    }
  })
  .as('health')
router.get('/privacy', ({ inertia }) => inertia.render('legal/privacy', {})).as('privacy')
router.get('/terms', ({ inertia }) => inertia.render('legal/terms', {})).as('terms')

// Mayar Webhook (Public Endpoint)
router.post('/api/webhooks/mayar', [MayarPaymentsController, 'webhook']).as('api.mayar.webhook')

// MCP Discovery & HTTP Transport Routes
router.get('/.well-known/mcp', [controllers.Mcp, 'wellKnown']).as('mcp.wellknown')
router.any('/mcp', [controllers.Mcp, 'handle']).use(middleware.mcpRateLimit()).as('mcp.handle')

router
  .get('/coming-soon', ({ inertia }) => {
    return inertia.render('coming-soon', {})
  })
  .as('coming-soon')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('new_account.store')

    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')

    router
      .get('auth/google/redirect', [controllers.GoogleAuth, 'redirect'])
      .as('auth.google.redirect')
    router
      .get('auth/google/callback', [controllers.GoogleAuth, 'callback'])
      .as('auth.google.callback')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())

// Dashboard routes
router
  .group(() => {
    // Onboarding
    router.get('/onboarding', [controllers.Onboarding, 'index']).as('onboarding.index')
    router.post('/onboarding', [controllers.Onboarding, 'store']).as('onboarding.store')

    // Dashboard
    router.get('/dashboard', [controllers.Dashboard, 'index']).as('dashboard')

    // Billing & Top-Up Kredit (Mayar.id)
    router.get('/billing', [controllers.AccountBilling, 'index']).as('billing.index')
    router.post('/api/topup/mayar', [MayarPaymentsController, 'checkout']).as('api.mayar.checkout')
    router
      .get('/api/topup/invoices/:invoiceNo', [MayarPaymentsController, 'checkStatus'])
      .as('api.mayar.status')

    router.get('/my-package', [controllers.AccountBilling, 'package']).as('account.package')
    router.get('/usage', [controllers.AccountBilling, 'usage']).as('account.usage')
    router
      .get('/subscriptions', [controllers.AccountBilling, 'subscriptions'])
      .as('account.subscriptions')

    // Tool-First Plain Express Routes
    router.get('/modul-ajar', [ExpressToolsController, 'modulAjar']).as('express.modulAjar')
    router.get('/lkpd', [ExpressToolsController, 'lkpd']).as('lkpd.index')
    router.get('/soal', [ExpressToolsController, 'soal']).as('express.soal')
    router.get('/prota-promes', [ExpressToolsController, 'protaPromes']).as('express.protaPromes')
    router.get('/rapor', [ExpressToolsController, 'rapor']).as('express.rapor')

    router.get('/katrol', [ExpressToolsController, 'katrol']).as('express.katrol')
    router
      .post('/api/express/katrol/generate', [ExpressToolsController, 'generateKatrol'])
      .as('api.express.katrol.generate')

    router.get('/jurnal', [ExpressToolsController, 'jurnal']).as('express.jurnal')
    router
      .post('/api/express/jurnal/generate', [ExpressToolsController, 'generateJurnal'])
      .as('api.express.jurnal.generate')

    router.get('/kokurikuler', [ExpressToolsController, 'kokurikuler']).as('express.kokurikuler')
    router
      .post('/api/express/kokurikuler/generate', [ExpressToolsController, 'generateKokurikuler'])
      .as('api.express.kokurikuler.generate')

    // Panel Terstruktur Aliases
    router.get('/panel/kurikulum', ({ response }) =>
      response.redirect().toRoute('curriculum.index')
    )
    router.get('/panel/kelas', ({ response }) => response.redirect().toRoute('classes.index'))
    router.get('/panel/siswa', ({ response }) => response.redirect().toRoute('classes.index'))
    router.get('/panel/asesmen-paud', ({ response }) =>
      response.redirect().toRoute('paud-assessments.index')
    )
    router.get('/panel/rapor', ({ response }) => response.redirect().toRoute('report-cards.index'))

    // Panduan istilah kurikulum
    router
      .get('/glossary', ({ inertia }) => inertia.render('dashboard/glossary/index', {}))
      .as('glossary.index')

    // Kurikulum terkontrol: CP Fase Fondasi, TP, ATP, dan IKTP
    router.get('/curriculum', [controllers.Curriculum, 'index']).as('curriculum.index')
    router.get('/curriculum/print', [controllers.Curriculum, 'print']).as('curriculum.print')
    router.get('/curriculum/export', [controllers.Curriculum, 'export']).as('curriculum.export')
    router
      .get('/curriculum/export/pdf', [controllers.Curriculum, 'exportPdf'])
      .as('curriculum.exportPdf')
    router
      .post('/documents/:type/:id/autosave', [controllers.DocumentWorkflows, 'autosave'])
      .as('documents.autosave')
    router
      .post('/documents/:type/:id/status', [controllers.DocumentWorkflows, 'status'])
      .as('documents.status')
    router
      .post('/documents/:type/:id/duplicate', [controllers.DocumentWorkflows, 'duplicate'])
      .as('documents.duplicate')
    router
      .post('/curriculum/objectives', [controllers.Curriculum, 'storeObjective'])
      .as('curriculum.objectives.store')
    router
      .delete('/curriculum/objectives/:id', [controllers.Curriculum, 'destroyObjective'])
      .as('curriculum.objectives.destroy')
    router
      .post('/curriculum/sequences', [controllers.Curriculum, 'storeSequence'])
      .as('curriculum.sequences.store')
    router
      .put('/curriculum/sequences/:id', [controllers.Curriculum, 'updateSequence'])
      .as('curriculum.sequences.update')
    router
      .delete('/curriculum/sequences/:id', [controllers.Curriculum, 'destroySequence'])
      .as('curriculum.sequences.destroy')
    router
      .post('/curriculum/indicators', [controllers.Curriculum, 'storeIndicator'])
      .as('curriculum.indicators.store')
    router
      .post('/curriculum/seed-presets', [controllers.Curriculum, 'seedPresets'])
      .as('curriculum.presets.seed')
    router
      .post('/curriculum/reset-presets', [controllers.Curriculum, 'resetPresets'])
      .as('curriculum.presets.reset')

    // Classes (Kelas)
    router.get('/classes', [controllers.Classes, 'index']).as('classes.index')
    router.post('/classes', [controllers.Classes, 'store']).as('classes.store')
    router.get('/classes/:id', [controllers.Classes, 'show']).as('classes.show')
    router.put('/classes/:id', [controllers.Classes, 'update']).as('classes.update')
    router.delete('/classes/:id', [controllers.Classes, 'destroy']).as('classes.destroy')
    router
      .post('/classes/:id/students', [controllers.Classes, 'addStudent'])
      .as('classes.addStudent')
    router
      .post('/classes/:id/students/import', [controllers.Classes, 'importStudents'])
      .as('classes.importStudents')
    router
      .put('/classes/:id/students/:studentId', [controllers.Classes, 'updateStudent'])
      .as('classes.updateStudent')
    router
      .delete('/classes/:id/students/:studentId', [controllers.Classes, 'removeStudent'])
      .as('classes.removeStudent')

    // Teaching Modules (Modul Ajar)
    router
      .get('/teaching-modules', [controllers.TeachingModules, 'index'])
      .as('teaching-modules.index')
    router
      .post('/teaching-modules', [controllers.TeachingModules, 'store'])
      .as('teaching-modules.store')
    router
      .get('/teaching-modules/:id', [controllers.TeachingModules, 'show'])
      .as('teaching-modules.show')
    router
      .put('/teaching-modules/:id', [controllers.TeachingModules, 'update'])
      .as('teaching-modules.update')
    router
      .delete('/teaching-modules/:id', [controllers.TeachingModules, 'destroy'])
      .as('teaching-modules.destroy')
    router
      .post('/teaching-modules/generate', [controllers.TeachingModules, 'generate'])
      .as('teaching-modules.generate')
    router
      .get('/teaching-modules/:id/export', [controllers.TeachingModules, 'export'])
      .as('teaching-modules.export')
    router
      .get('/teaching-modules/:id/export/pdf', [controllers.TeachingModules, 'exportPdf'])
      .as('teaching-modules.exportPdf')

    // Exams (Soal)
    router.get('/exams', [controllers.Exams, 'index']).as('exams.index')
    router.post('/exams', [controllers.Exams, 'store']).as('exams.store')
    router
      .get('/exams/:id/generation-status', [controllers.Exams, 'generationStatus'])
      .as('exams.generationStatus')
    router.get('/exams/:id', [controllers.Exams, 'show']).as('exams.show')
    router
      .post('/exams/:id/upload-image', [controllers.Exams, 'uploadImage'])
      .as('exams.uploadImage')
    router.put('/exams/:id', [controllers.Exams, 'update']).as('exams.update')
    router.delete('/exams/:id', [controllers.Exams, 'destroy']).as('exams.destroy')
    router.post('/exams/generate', [controllers.Exams, 'generate']).as('exams.generate')
    router.get('/exams/:id/export', [controllers.Exams, 'export']).as('exams.export')
    router.get('/exams/:id/export/pdf', [controllers.Exams, 'exportPdf']).as('exams.exportPdf')
    router
      .get('/exams/:id/print-preview', [controllers.Exams, 'printPreview'])
      .as('exams.printPreview')

    // Annual Plans (Protah)
    router.get('/annual-plans', [controllers.AnnualPlans, 'index']).as('annual-plans.index')
    router.post('/annual-plans', [controllers.AnnualPlans, 'store']).as('annual-plans.store')
    router.get('/annual-plans/:id', [controllers.AnnualPlans, 'show']).as('annual-plans.show')
    router.put('/annual-plans/:id', [controllers.AnnualPlans, 'update']).as('annual-plans.update')
    router
      .delete('/annual-plans/:id', [controllers.AnnualPlans, 'destroy'])
      .as('annual-plans.destroy')
    router
      .post('/annual-plans/generate', [controllers.AnnualPlans, 'generate'])
      .as('annual-plans.generate')
    router
      .get('/annual-plans/:id/export', [controllers.AnnualPlans, 'export'])
      .as('annual-plans.export')
    router
      .get('/annual-plans/:id/export/pdf', [controllers.AnnualPlans, 'exportPdf'])
      .as('annual-plans.exportPdf')

    // Semester Plans (Promes)
    router.get('/semester-plans', [controllers.SemesterPlans, 'index']).as('semester-plans.index')
    router.post('/semester-plans', [controllers.SemesterPlans, 'store']).as('semester-plans.store')
    router.get('/semester-plans/:id', [controllers.SemesterPlans, 'show']).as('semester-plans.show')
    router
      .put('/semester-plans/:id', [controllers.SemesterPlans, 'update'])
      .as('semester-plans.update')
    router
      .delete('/semester-plans/:id', [controllers.SemesterPlans, 'destroy'])
      .as('semester-plans.destroy')
    router
      .post('/semester-plans/generate', [controllers.SemesterPlans, 'generate'])
      .as('semester-plans.generate')
    router
      .get('/semester-plans/:id/export', [controllers.SemesterPlans, 'export'])
      .as('semester-plans.export')
    router
      .get('/semester-plans/:id/export/pdf', [controllers.SemesterPlans, 'exportPdf'])
      .as('semester-plans.exportPdf')

    // RPPM / RPM (rencana mingguan TK/PAUD/RA)
    router.get('/rppm', [controllers.WeeklyLessonPlans, 'index']).as('rppm.index')
    router.get('/rppm/:id', [controllers.WeeklyLessonPlans, 'show']).as('rppm.show')
    router.get('/rppm/:id/export', [controllers.WeeklyLessonPlans, 'export']).as('rppm.export')
    router
      .get('/rppm/:id/export/pdf', [controllers.WeeklyLessonPlans, 'exportPdf'])
      .as('rppm.exportPdf')
    router.put('/rppm/:id', [controllers.WeeklyLessonPlans, 'update']).as('rppm.update')
    router.delete('/rppm/:id', [controllers.WeeklyLessonPlans, 'destroy']).as('rppm.destroy')
    router.post('/rppm/generate', [controllers.WeeklyLessonPlans, 'generate']).as('rppm.generate')

    // Alias /rpm -> /rppm
    router.get('/rpm', ({ response }) => response.redirect().toRoute('rppm.index'))
    router.get('/rpm/:id', ({ params, response }) =>
      response.redirect().toRoute('rppm.show', { id: params.id })
    )
    router.get('/rpm/:id/export', ({ params, response }) =>
      response.redirect().toRoute('rppm.export', { id: params.id })
    )
    router.get('/rpm/:id/export/pdf', ({ params, response }) =>
      response.redirect().toRoute('rppm.exportPdf', { id: params.id })
    )

    // RPPH (rencana harian TK/PAUD)
    router.get('/rpph', [controllers.DailyLessonPlans, 'index']).as('rpph.index')
    router.get('/rpph/:id', [controllers.DailyLessonPlans, 'show']).as('rpph.show')
    router.get('/rpph/:id/export', [controllers.DailyLessonPlans, 'export']).as('rpph.export')
    router
      .get('/rpph/:id/export/pdf', [controllers.DailyLessonPlans, 'exportPdf'])
      .as('rpph.exportPdf')
    router.put('/rpph/:id', [controllers.DailyLessonPlans, 'update']).as('rpph.update')
    router.delete('/rpph/:id', [controllers.DailyLessonPlans, 'destroy']).as('rpph.destroy')
    router.post('/rpph/generate', [controllers.DailyLessonPlans, 'generate']).as('rpph.generate')

    // LKPD (Lembar Kerja Peserta Didik / Lembar Aktivitas Anak)
    router.get('/lkpd/:id', [controllers.Lkpds, 'show']).as('lkpd.show')
    router.get('/lkpd/:id/export', [controllers.Lkpds, 'export']).as('lkpd.export')
    router.get('/lkpd/:id/export/pdf', [controllers.Lkpds, 'exportPdf']).as('lkpd.exportPdf')
    router.delete('/lkpd/:id', [controllers.Lkpds, 'destroy']).as('lkpd.destroy')
    router.post('/lkpd/generate', [controllers.Lkpds, 'generate']).as('lkpd.generate')

    // Media Ajar (Outline Slide & Loose Parts Guide)
    router.get('/media-modules', [controllers.MediaModules, 'index']).as('media-modules.index')
    router.get('/media-modules/:id', [controllers.MediaModules, 'show']).as('media-modules.show')
    router
      .delete('/media-modules/:id', [controllers.MediaModules, 'destroy'])
      .as('media-modules.destroy')
    router
      .post('/media-modules/generate', [controllers.MediaModules, 'generate'])
      .as('media-modules.generate')
    router
      .get('/media-modules/:id/export/pptx', [controllers.MediaModules, 'exportPptx'])
      .as('media-modules.exportPptx')
    router
      .get('/media-modules/:id/export/pdf', [controllers.MediaModules, 'exportPdf'])
      .as('media-modules.exportPdf')

    // Asesmen PAUD (ceklis, catatan anekdot, hasil karya, foto berseri)
    router
      .get('/paud-assessments', [controllers.PaudAssessments, 'index'])
      .as('paud-assessments.index')
    router
      .post('/paud-assessments', [controllers.PaudAssessments, 'store'])
      .as('paud-assessments.store')
    router
      .post('/paud-assessments/generate-ai', [controllers.PaudAssessments, 'generateAi'])
      .as('paud-assessments.generateAi')
    router
      .get('/paud-assessments/export-bundle', [controllers.PaudAssessments, 'exportBundle'])
      .as('paud-assessments.exportBundle')
    router
      .get('/paud-assessments/export-bundle/pdf', [controllers.PaudAssessments, 'exportBundlePdf'])
      .as('paud-assessments.exportBundlePdf')
    router
      .put('/paud-assessments/:id', [controllers.PaudAssessments, 'update'])
      .as('paud-assessments.update')
    router
      .delete('/paud-assessments/:id', [controllers.PaudAssessments, 'destroy'])
      .as('paud-assessments.destroy')
    router
      .get('/paud-assessments/:id/export', [controllers.PaudAssessments, 'export'])
      .as('paud-assessments.export')
    router
      .get('/paud-assessments/:id/export/pdf', [controllers.PaudAssessments, 'exportPdf'])
      .as('paud-assessments.exportPdf')
    router
      .get('/paud-assessments/:id/attachments/:attachmentId', [
        controllers.AssessmentAttachments,
        'show',
      ])
      .as('paud-assessments.attachments.show')

    // Assessments (Penilaian & Nilai)
    router.get('/assessments', [controllers.Assessments, 'index']).as('assessments.index')
    router.post('/assessments', [controllers.Assessments, 'store']).as('assessments.store')
    router.get('/assessments/:id', [controllers.Assessments, 'show']).as('assessments.show')
    router
      .put('/assessments/:id/scores', [controllers.Assessments, 'updateScores'])
      .as('assessments.updateScores')
    router
      .delete('/assessments/:id', [controllers.Assessments, 'destroy'])
      .as('assessments.destroy')
    router
      .get('/assessments/:id/export', [controllers.Assessments, 'export'])
      .as('assessments.export')
    router
      .get('/assessments/:id/export/docx', [controllers.Assessments, 'exportDocx'])
      .as('assessments.exportDocx')
    router
      .get('/assessments/:id/export/pdf', [controllers.Assessments, 'exportPdf'])
      .as('assessments.exportPdf')

    // Kepala Sekolah — dashboard read-only
    router
      .get('/principal', [controllers.PrincipalDashboard, 'index'])
      .as('principal.index')
      .use(middleware.role({ roles: ['kepala_sekolah'] }))
    router
      .get('/principal/teachers/:userId', [controllers.PrincipalDashboard, 'teacher'])
      .as('principal.teacher')
      .use(middleware.role({ roles: ['kepala_sekolah'] }))

    // Rapor & Peringkat
    router.get('/report-cards', [controllers.ReportCards, 'index']).as('report-cards.index')
    router
      .get('/report-cards/:classId/:semesterId', [controllers.ReportCards, 'show'])
      .as('report-cards.show')
    router
      .get('/report-cards/:classId/:semesterId/:studentId/export', [
        controllers.ReportCards,
        'exportPdf',
      ])
      .as('report-cards.exportPdf')
    router
      .get('/report-cards/:classId/:semesterId/:studentId/export/docx', [
        controllers.ReportCards,
        'exportDocx',
      ])
      .as('report-cards.exportDocx')
    router
      .post('/report-cards/:classId/:semesterId/:studentId/narratives', [
        controllers.ReportCards,
        'saveNarrative',
      ])
      .as('report-cards.narratives.save')
    router
      .post('/report-cards/:classId/:semesterId/narratives/generate', [
        controllers.ReportCards,
        'generateNarratives',
      ])
      .as('report-cards.narratives.generate')
    router
      .post('/report-narratives/:id/approve', [controllers.ReportCards, 'approveNarrative'])
      .as('report-narratives.approve')

    // Subjects (Mata Pelajaran)
    router.get('/subjects', [controllers.Subjects, 'index']).as('subjects.index')
    router.post('/subjects', [controllers.Subjects, 'store']).as('subjects.store')
    router
      .post('/subjects/defaults', [controllers.Subjects, 'storeDefaults'])
      .as('subjects.storeDefaults')
    router.put('/subjects/:id', [controllers.Subjects, 'update']).as('subjects.update')
    router.delete('/subjects/:id', [controllers.Subjects, 'destroy']).as('subjects.destroy')

    // Settings (Pengaturan)
    router.get('/settings', [controllers.Settings, 'index']).as('settings.index')
    router.put('/settings', [controllers.Settings, 'update']).as('settings.update')

    // Admin — Manage Users
    router
      .get('/admin/users', [controllers.AdminUsers, 'index'])
      .as('admin.users.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/users/:id', [controllers.AdminUsers, 'update'])
      .as('admin.users.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/users/:id', [controllers.AdminUsers, 'destroy'])
      .as('admin.users.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Manage Packages
    router
      .get('/admin/packages', [controllers.AdminPackages, 'index'])
      .as('admin.packages.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/packages', [controllers.AdminPackages, 'store'])
      .as('admin.packages.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/packages/:id', [controllers.AdminPackages, 'update'])
      .as('admin.packages.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/packages/:id', [controllers.AdminPackages, 'destroy'])
      .as('admin.packages.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    router
      .get('/admin/entitlements', [controllers.AdminEntitlements, 'index'])
      .as('admin.entitlements.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/entitlements/:id', [controllers.AdminEntitlements, 'update'])
      .as('admin.entitlements.update')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Tahun Ajaran
    router
      .get('/admin/academic-years', [controllers.AdminAcademicYears, 'index'])
      .as('admin.academic-years.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/academic-years', [controllers.AdminAcademicYears, 'store'])
      .as('admin.academic-years.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/academic-years/:id', [controllers.AdminAcademicYears, 'update'])
      .as('admin.academic-years.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/academic-years/:id', [controllers.AdminAcademicYears, 'destroy'])
      .as('admin.academic-years.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Sekolah
    router
      .get('/admin/schools', [controllers.AdminSchools, 'index'])
      .as('admin.schools.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/schools', [controllers.AdminSchools, 'store'])
      .as('admin.schools.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/schools/:id', [controllers.AdminSchools, 'update'])
      .as('admin.schools.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/schools/:id', [controllers.AdminSchools, 'destroy'])
      .as('admin.schools.destroy')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Konfigurasi AI
    router
      .get('/admin/ai-settings', [controllers.AdminAiSettings, 'index'])
      .as('admin.ai-settings.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/ai-settings', [controllers.AdminAiSettings, 'update'])
      .as('admin.ai-settings.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/ai-settings/test', [controllers.AdminAiSettings, 'test'])
      .as('admin.ai-settings.test')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/ai-settings/models', [controllers.AdminAiSettings, 'models'])
      .as('admin.ai-settings.models')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .get('/admin/ai-settings/oauth/openai/start', [controllers.AdminAiSettings, 'oauthStart'])
      .as('admin.ai-settings.oauth.openai.start')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .get('/admin/ai-settings/oauth/gemini/start', [
        controllers.AdminAiSettings,
        'geminiOauthStart',
      ])
      .as('admin.ai-settings.oauth.gemini.start')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .get('/admin/ai-settings/oauth/gemini/callback', [
        controllers.AdminAiSettings,
        'geminiOauthCallback',
      ])
      .as('admin.ai-settings.oauth.gemini.callback')
      .use(middleware.role({ roles: ['admin'] }))

    // Admin — Preset Kurikulum
    router
      .get('/admin/curriculum-presets', [controllers.AdminCurriculumPresets, 'index'])
      .as('admin.curriculum-presets.index')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/curriculum-presets', [controllers.AdminCurriculumPresets, 'store'])
      .as('admin.curriculum-presets.store')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .put('/admin/curriculum-presets/:id', [controllers.AdminCurriculumPresets, 'update'])
      .as('admin.curriculum-presets.update')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .delete('/admin/curriculum-presets/:id', [controllers.AdminCurriculumPresets, 'destroy'])
      .as('admin.curriculum-presets.destroy')
      .use(middleware.role({ roles: ['admin'] }))
    router
      .post('/admin/curriculum-presets/reset-defaults', [
        controllers.AdminCurriculumPresets,
        'resetDefaults',
      ])
      .as('admin.curriculum-presets.resetDefaults')
      .use(middleware.role({ roles: ['admin'] }))
  })
  .use([middleware.auth(), middleware.onboarding()])

// Import Dedicated Mobile & REST API Routes
import './routes/api.js'
