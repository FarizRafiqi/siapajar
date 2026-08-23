import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

/*
|--------------------------------------------------------------------------
| 📱 Mobile API Routes (v1)
|--------------------------------------------------------------------------
|
| Dedicated REST API endpoints for SiapAjar Mobile Companion App
| Reusing core application controllers with smart dual-response / content negotiation.
| Base URL: /api/v1
|
*/

router
  .group(() => {
    // 1. Authentication (Password & Google OAuth)
    router.post('/auth/login', [controllers.Session, 'store']).as('auth.login')
    router.post('/auth/logout', [controllers.Session, 'destroy']).as('auth.logout')
    router
      .get('/auth/google/redirect', [controllers.GoogleAuth, 'redirect'])
      .as('auth.google.redirect')
    router
      .get('/auth/google/callback', [controllers.GoogleAuth, 'callback'])
      .as('auth.google.callback')

    // 2. Classes, Students & Agenda
    router.get('/classes', [controllers.Classes, 'index']).as('classes.index')
    router.get('/classes/:id/students', [controllers.Classes, 'getStudents']).as('classes.students')
    router
      .get('/classes/:id/today-agenda', [controllers.Classes, 'getTodayAgenda'])
      .as('classes.agenda')
    router
      .post('/attendances/quick-submit', [controllers.Classes, 'quickSubmitAttendance'])
      .as('attendances.quickSubmit')

    // 3. Assessments & Timeline
    router.get('/assessments', [controllers.PaudAssessments, 'index']).as('assessments.index')
    router
      .get('/students/:id/timeline', [controllers.PaudAssessments, 'getStudentTimeline'])
      .as('students.timeline')
    router
      .post('/assessments/quick-capture', [controllers.PaudAssessments, 'quickCapture'])
      .as('assessments.quickCapture')
  })
  .prefix('/api/v1')
  .as('api')
