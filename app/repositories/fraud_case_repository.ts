import FraudCase from '#models/fraud_case'
import { DateTime } from 'luxon'

export class FraudCaseRepository {
  async paginate(page: number, perPage: number, status?: string) {
    const query = FraudCase.query().orderBy('createdAt', 'desc')
    if (status && ['open', 'approved', 'rejected'].includes(status)) query.where('status', status)
    return query.paginate(page, perPage)
  }

  async review(id: number, reviewerId: number, status: 'approved' | 'rejected') {
    const fraudCase = await FraudCase.find(id)
    if (!fraudCase) return null
    fraudCase.status = status
    fraudCase.reviewedByUserId = reviewerId
    fraudCase.reviewedAt = DateTime.now()
    await fraudCase.save()
    return fraudCase
  }
}

export const fraudCaseRepository = new FraudCaseRepository()
