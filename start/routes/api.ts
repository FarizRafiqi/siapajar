import router from '@adonisjs/core/services/router'

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
    // 1. Authentication
    router.post('/auth/login', '#controllers/session_controller.store')
    router.post('/auth/logout', '#controllers/session_controller.destroy')

    // 2. Classes, Students & Agenda
    router.get('/classes', '#controllers/classes_controller.index')
    router.get('/classes/:id/students', '#controllers/classes_controller.getStudents')
    router.get('/classes/:id/today-agenda', '#controllers/classes_controller.getTodayAgenda')
    router.post(
      '/attendances/quick-submit',
      '#controllers/classes_controller.quickSubmitAttendance'
    )

    // 3. Assessments & Timeline
    router.get('/assessments', '#controllers/paud_assessments_controller.index')
    router.get(
      '/students/:id/timeline',
      '#controllers/paud_assessments_controller.getStudentTimeline'
    )
    router.post(
      '/assessments/quick-capture',
      '#controllers/paud_assessments_controller.quickCapture'
    )
  })
  .prefix('/api/v1')
