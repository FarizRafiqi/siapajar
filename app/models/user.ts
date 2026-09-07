import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Package from '#models/package'
import School from '#models/school'
import PackageSubscription from '#models/package_subscription'
import CreditTransaction from '#models/credit_transaction'
import PaymentInvoice from '#models/payment_invoice'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static readonly table = 'users'
  static readonly rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: string

  @column()
  declare packageId: number | null

  @column({ columnName: 'school_name' })
  declare schoolName: string | null

  @column({ columnName: 'education_level' })
  declare educationLevel: string | null

  @column({ columnName: 'institution_type' })
  declare institutionType: 'tk' | 'ra' | null

  @column({ columnName: 'curriculum_version' })
  declare curriculumVersion: string | null

  @column({ columnName: 'default_group_context' })
  declare defaultGroupContext: 'a' | 'b' | null

  @column({ columnName: 'school_id' })
  declare schoolId: number | null

  @column({ columnName: 'google_id', serializeAs: null })
  declare googleId: string | null

  @column({ columnName: 'avatar_url' })
  declare avatarUrl: string | null

  @column({
    columnName: 'kop_surat',
    prepare: (value: Record<string, any>) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => (typeof value === 'string' ? JSON.parse(value) : (value ?? {})),
  })
  declare kopSurat: {
    logoUrl?: string
    institutionName?: string
    institutionSubName?: string
    addressLine1?: string
    addressLine2?: string
    phone?: string
  }

  @column({ columnName: 'credits_balance' })
  declare creditsBalance: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Package, { foreignKey: 'packageId' })
  declare package: BelongsTo<typeof Package>

  @belongsTo(() => School, { foreignKey: 'schoolId' })
  declare school: BelongsTo<typeof School>

  @hasMany(() => PackageSubscription, { foreignKey: 'userId' })
  declare subscriptions: HasMany<typeof PackageSubscription>

  @hasMany(() => CreditTransaction, { foreignKey: 'userId' })
  declare creditTransactions: HasMany<typeof CreditTransaction>

  @hasMany(() => PaymentInvoice, { foreignKey: 'userId' })
  declare paymentInvoices: HasMany<typeof PaymentInvoice>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  get isAdmin() {
    return this.role === 'admin'
  }

  get isGuru() {
    return this.role === 'guru'
  }

  get isKepalaSekolah() {
    return this.role === 'kepala_sekolah'
  }

  get isTk() {
    return this.educationLevel === 'tk'
  }

  get isSd() {
    return this.educationLevel === 'sd'
  }
}
