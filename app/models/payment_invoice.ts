import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class PaymentInvoice extends BaseModel {
  static readonly table = 'payment_invoices'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'invoice_no' })
  declare invoiceNo: string

  @column({ columnName: 'package_name' })
  declare packageName: string

  @column({ columnName: 'credits_amount' })
  declare creditsAmount: number

  @column({ columnName: 'gross_amount' })
  declare grossAmount: number

  @column()
  declare status: 'pending' | 'paid' | 'expired' | 'failed'

  @column({ columnName: 'payment_gateway' })
  declare paymentGateway: string

  @column({ columnName: 'gateway_transaction_id' })
  declare gatewayTransactionId: string | null

  @column({ columnName: 'payment_url' })
  declare paymentUrl: string | null

  @column({ columnName: 'payment_method' })
  declare paymentMethod: string | null

  @column.dateTime({ columnName: 'paid_at' })
  declare paidAt: DateTime | null

  @column({
    prepare: (value: Record<string, any> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare metadata: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}
