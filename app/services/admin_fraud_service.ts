import { fraudCaseRepository, type FraudCaseRepository } from '#repositories/fraud_case_repository'
import { auditService } from '#services/audit_service'

export class AdminFraudService {
  constructor(private readonly repository: FraudCaseRepository = fraudCaseRepository) {}

  async list(page: number, perPage: number, status?: string, search?: string) {
    const normalizedStatus =
      status && ['open', 'approved', 'rejected'].includes(status) ? status : undefined
    const normalizedSearch = search?.trim() || ''
    const cases = await this.repository.paginate(page, perPage, normalizedStatus, normalizedSearch)
    return {
      cases: cases.serialize(),
      filters: { page, perPage, status: normalizedStatus || 'all', q: normalizedSearch },
    }
  }

  async review(id: number, reviewerId: number, status: 'approved' | 'rejected') {
    const fraudCase = await this.repository.review(id, reviewerId, status)
    if (fraudCase) {
      await auditService.recordCritical({
        actorId: reviewerId,
        action: 'admin.fraud_case.reviewed',
        entityType: 'fraud_case',
        entityId: fraudCase.id,
        metadata: { type: fraudCase.type, status },
      })
    }
    return fraudCase
  }
}

export const adminFraudService = new AdminFraudService()
