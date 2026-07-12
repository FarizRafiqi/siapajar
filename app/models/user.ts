import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Package from '#models/package'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'
  static readonly rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: string

  @column()
  declare packageId: number | null

  @column({ columnName: 'school_name' })
  declare schoolName: string | null

  @column({ columnName: 'education_level' })
  declare educationLevel: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Package, { foreignKey: 'package_id' })
  declare package: BelongsTo<typeof Package>

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
