import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { startMcpServer } from '../mcp/index.js'

export default class McpServe extends BaseCommand {
  static commandName = 'mcp:serve'
  static description = 'Start the SiapAjar MCP server container and listen over stdio'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  async run() {
    const { close } = await startMcpServer()

    const shutdown = async () => {
      await close()
      this.exitCode = 0
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  }
}
