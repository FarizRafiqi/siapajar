import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Package from '#models/package'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static readonly accessTokens = DbAccessTokensProvider.forModel(User)

  @column()
  declare role: string

  @column()
  declare packageId: number | null

  @belongsTo(() => Package)
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
}
