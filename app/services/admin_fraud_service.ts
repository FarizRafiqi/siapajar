import { fraudCaseRepository, type FraudCaseRepository } from '#repositories/fraud_case_repository'

export class AdminFraudService {
  constructor(private readonly repository: FraudCaseRepository = fraudCaseRepository) {}

  async list(page: number, perPage: number, status?: string) {
    const cases = await this.repository.paginate(page, perPage, status)
    return { cases: cases.serialize(), filters: { page, perPage, status: status || 'all' } }
  }

  async review(id: number, reviewerId: number, status: 'approved' | 'rejected') {
    return this.repository.review(id, reviewerId, status)
  }
}

export const adminFraudService = new AdminFraudService()
