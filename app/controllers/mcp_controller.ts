import type { HttpContext } from '@adonisjs/core/http'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from '../../mcp/index.js'
import { mcpAuthStorage } from '../../mcp/auth.js'

export default class McpController {
  private mcpServer = createMcpServer()

  async handle({ request, response }: HttpContext) {
    const authHeader = request.header('authorization')
    let httpKey: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      httpKey = authHeader.substring(7).trim()
    }

    const transport = new StreamableHTTPServerTransport()
    await this.mcpServer.connect(transport)

    return mcpAuthStorage.run({ apiKey: httpKey }, async () => {
      await transport.handleRequest(request.request, response.response, request.body())
    })
  }

  async wellKnown({ response }: HttpContext) {
    return response.ok({
      name: 'SiapAjar MCP Server',
      version: '1.0.0',
      description: 'Model Context Protocol endpoint for SiapAjar educational management platform.',
      protocol_version: '2024-11-05',
      endpoint: 'https://siapajar.farizrafiqi.dev/mcp',
      authentication: {
        type: 'bearer',
        header: 'Authorization',
        format: 'Bearer <siapajar_mcp_key>',
      },
      transports: ['streamable-http', 'stdio'],
      tool_groups: ['health', 'admin', 'documents', 'assessments', 'curriculum'],
    })
  }
}
