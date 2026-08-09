import { DateTime } from 'luxon'
import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import McpKey from '#models/mcp_key'

export default class McpKeyRevoke extends BaseCommand {
  static commandName = 'mcp:key:revoke'
  static description = 'Revoke an active MCP API key by ID or hash prefix'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'ID or key hash prefix of the key to revoke' })
  declare keyIdentifier: string

  async run() {
    const keyId = Number.parseInt(this.keyIdentifier, 10)
    let key: McpKey | null = null

    if (!Number.isNaN(keyId)) {
      key = await McpKey.find(keyId)
    }

    if (!key) {
      key = await McpKey.query().where('key_hash', 'like', `${this.keyIdentifier}%`).first()
    }

    if (!key) {
      this.logger.error(`MCP Key not found matching "${this.keyIdentifier}".`)
      this.exitCode = 1
      return
    }

    if (key.revokedAt) {
      this.logger.info(`MCP Key ID ${key.id} ("${key.label}") is already revoked.`)
      return
    }

    key.revokedAt = DateTime.now()
    await key.save()

    this.logger.success(
      `SUCCESS: MCP Key ID ${key.id} ("${key.label}") for user ID ${key.userId} has been revoked.`
    )
  }
}
