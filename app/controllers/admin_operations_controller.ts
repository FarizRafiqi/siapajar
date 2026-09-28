import type { HttpContext } from '@adonisjs/core/http'
import { operationsObservabilityService } from '#services/operations_observability_service'

export default class AdminOperationsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('dashboard/admin/operations/index' as any, {
      overview: await operationsObservabilityService.getOverview(),
    })
  }
}
