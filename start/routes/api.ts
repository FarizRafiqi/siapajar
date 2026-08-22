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
    router.post('/auth/login', [controllers.Session, 'store'])
    router.post('/auth/logout', [controllers.Session, 'destroy'])
    router.get('/auth/google/redirect', [controllers.GoogleAuth, 'redirect'])
    router.get('/auth/google/callback', [controllers.GoogleAuth, 'callback'])

    // 2. Classes, Students & Agenda
    router.get('/classes', [controllers.Classes, 'index'])
    router.get('/classes/:id/students', [controllers.Classes, 'getStudents'])
    router.get('/classes/:id/today-agenda', [controllers.Classes, 'getTodayAgenda'])
    router.post('/attendances/quick-submit', [controllers.Classes, 'quickSubmitAttendance'])

    // 3. Assessments & Timeline
    router.get('/assessments', [controllers.PaudAssessments, 'index'])
    router.get('/students/:id/timeline', [controllers.PaudAssessments, 'getStudentTimeline'])
    router.post('/assessments/quick-capture', [controllers.PaudAssessments, 'quickCapture'])
  })
  .prefix('/api/v1')
