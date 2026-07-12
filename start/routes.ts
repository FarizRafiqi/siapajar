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

router.get('/', ({ inertia }) => {
  return inertia.render('home', {})
}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
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
    router.delete('/classes/:id/students/:studentId', '#controllers/classes_controller.removeStudent').as('classes.removeStudent')

    // Teaching Modules (Modul Ajar)
    router.get('/teaching-modules', '#controllers/teaching_modules_controller.index').as('teaching-modules.index')
    router.post('/teaching-modules', '#controllers/teaching_modules_controller.store').as('teaching-modules.store')
    router.get('/teaching-modules/:id', '#controllers/teaching_modules_controller.show').as('teaching-modules.show')
    router.put('/teaching-modules/:id', '#controllers/teaching_modules_controller.update').as('teaching-modules.update')
    router.delete('/teaching-modules/:id', '#controllers/teaching_modules_controller.destroy').as('teaching-modules.destroy')
    router.post('/teaching-modules/generate', '#controllers/teaching_modules_controller.generate').as('teaching-modules.generate')

    // Exams (Soal)
    router.get('/exams', '#controllers/exams_controller.index').as('exams.index')
    router.post('/exams', '#controllers/exams_controller.store').as('exams.store')
    router.get('/exams/:id', '#controllers/exams_controller.show').as('exams.show')
    router.put('/exams/:id', '#controllers/exams_controller.update').as('exams.update')
    router.delete('/exams/:id', '#controllers/exams_controller.destroy').as('exams.destroy')
    router.post('/exams/generate', '#controllers/exams_controller.generate').as('exams.generate')

    // Annual Plans (Prota)
    router.get('/annual-plans', '#controllers/annual_plans_controller.index').as('annual-plans.index')
    router.post('/annual-plans', '#controllers/annual_plans_controller.store').as('annual-plans.store')
    router.get('/annual-plans/:id', '#controllers/annual_plans_controller.show').as('annual-plans.show')
    router.put('/annual-plans/:id', '#controllers/annual_plans_controller.update').as('annual-plans.update')
    router.delete('/annual-plans/:id', '#controllers/annual_plans_controller.destroy').as('annual-plans.destroy')
    router.post('/annual-plans/generate', '#controllers/annual_plans_controller.generate').as('annual-plans.generate')

    // Semester Plans (Promes)
    router.get('/semester-plans', '#controllers/semester_plans_controller.index').as('semester-plans.index')
    router.post('/semester-plans', '#controllers/semester_plans_controller.store').as('semester-plans.store')
    router.get('/semester-plans/:id', '#controllers/semester_plans_controller.show').as('semester-plans.show')
    router.put('/semester-plans/:id', '#controllers/semester_plans_controller.update').as('semester-plans.update')
    router.delete('/semester-plans/:id', '#controllers/semester_plans_controller.destroy').as('semester-plans.destroy')
    router.post('/semester-plans/generate', '#controllers/semester_plans_controller.generate').as('semester-plans.generate')

    // Settings (Pengaturan)
    router.get('/settings', '#controllers/settings_controller.index').as('settings.index')
    router.put('/settings', '#controllers/settings_controller.update').as('settings.update')
  })
  .use([middleware.auth(), middleware.onboarding()])
