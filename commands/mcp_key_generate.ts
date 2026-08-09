import crypto from 'node:crypto'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import McpKey from '#models/mcp_key'

export default class McpKeyGenerate extends BaseCommand {
  static commandName = 'mcp:key:generate'
  static description = 'Issue a per-user MCP API key'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Target user ID for the API key identity' })
  declare userId: string

  @flags.string({ description: 'Descriptive label (e.g. Hermes Mas Eel)', required: true })
  declare label: string

  @flags.string({ description: 'Comma-separated group scopes (optional)' })
  declare scopes?: string

  async run() {
    const id = Number.parseInt(this.userId, 10)
    if (Number.isNaN(id)) {
      this.logger.error('Invalid user_id provided. Must be an integer.')
      this.exitCode = 1
      return
    }

    const user = await User.query().where('id', id).preload('school').first()
    if (!user) {
      this.logger.error(`User ID ${id} not found.`)
      this.exitCode = 1
      return
    }

    const rawKey = `sk_mcp_${crypto.randomBytes(32).toString('hex')}`
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')
    const parsedScopes = this.scopes
      ? this.scopes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : null

    const mcpKey = await McpKey.create({
      userId: user.id,
      keyHash,
      label: this.label,
      scopes: parsedScopes,
    })

    const schoolDisplay = user.school
      ? `${user.school.name} (ID: ${user.schoolId})`
      : user.schoolName
        ? `${user.schoolName}`
        : 'N/A'
    const scopesDisplay = parsedScopes ? JSON.stringify(parsedScopes) : '[ALL (Inherit Role)]'

    this.logger.log('')
    this.logger.log('====================================================================')
    this.logger.log('               SiapAjar MCP Key Successfully Issued')
    this.logger.log('====================================================================')
    this.logger.log(`Key ID      : ${mcpKey.id}`)
    this.logger.log(`User ID     : ${user.id} (${user.fullName || user.email})`)
    this.logger.log(`Role        : ${user.role}`)
    this.logger.log(`School      : ${schoolDisplay}`)
    this.logger.log(`Label       : ${this.label}`)
    this.logger.log(`Scopes      : ${scopesDisplay}`)
    this.logger.log('')
    this.logger.log('API KEY (COPY NOW - WILL NOT BE SHOWN AGAIN):')
    this.logger.log('--------------------------------------------------------------------')
    this.logger.log(rawKey)
    this.logger.log('--------------------------------------------------------------------')
    this.logger.log('Config snippet for Hermes (.hermes/config.yaml):')
    this.logger.log('mcpServers:')
    this.logger.log('  siapajar:')
    this.logger.log('    command: "node"')
    this.logger.log('    args: ["ace", "mcp:serve"]')
    this.logger.log('    env:')
    this.logger.log(`      SIAPAJAR_MCP_API_KEY: "${rawKey}"`)
    this.logger.log('====================================================================')
  }
}
