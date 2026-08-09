/**
 * SiapAjar MCP Server — stdio transport
 *
 * Entry point for the Model Context Protocol server that exposes SiapAjar
 * data and app services to AI assistants via JSON-RPC over stdio.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerAllTools } from './registry.js'

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'siapajar',
    version: '1.0.0',
  })
  registerAllTools(server)
  return server
}

export async function startMcpServer(): Promise<{ server: McpServer; close: () => Promise<void> }> {
  const server = createMcpServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)

  const close = async () => {
    await server.close()
  }

  return { server, close }
}

// Standalone execution entrypoint if run directly
if (
  process.argv[1] &&
  (process.argv[1].endsWith('mcp/index.ts') || process.argv[1].endsWith('mcp/index.js'))
) {
  startMcpServer().catch((err) => {
    process.stderr.write(`Fatal MCP Error: ${err instanceof Error ? err.message : String(err)}\n`)
    process.exit(1)
  })
}
