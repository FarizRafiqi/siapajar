/**
 * SiapAjar MCP Server — stdio transport
 *
 * Entry point for the Model Context Protocol server that exposes SiapAjar
 * data to AI assistants (Hermes, Claude Code, etc.) via JSON-RPC over stdio.
 *
 * Auth: every tool call requires an `api_key` argument that must match the
 * SIAPAJAR_MCP_API_KEY environment variable.  If the variable is unset the
 * server rejects all calls with a clear configuration error.  The key is
 * never written to logs.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { closePool, dbHealth, listSchools } from './db.js'

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

const API_KEY_PARAM = { api_key: z.string().describe('API key (must match SIAPAJAR_MCP_API_KEY)') }

type AuthedArgs = { api_key: string }

function checkAuth(args: AuthedArgs): { ok: true } | { ok: false; error: string } {
  const configured = process.env.SIAPAJAR_MCP_API_KEY
  if (!configured) {
    return {
      ok: false,
      error:
        'SIAPAJAR_MCP_API_KEY is not set. Set this environment variable before starting the MCP server.',
    }
  }
  if (args.api_key !== configured) {
    return { ok: false, error: 'Invalid api_key.' }
  }
  return { ok: true }
}

function authError(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
    isError: true,
  }
}

function okResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  }
}

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: 'siapajar',
  version: '1.0.0',
})

// ---------------------------------------------------------------------------
// Tool: siapajar_health
// ---------------------------------------------------------------------------

server.registerTool(
  'siapajar_health',
  {
    description: 'Check database connectivity and report server health.',
    inputSchema: z.object(API_KEY_PARAM),
  },
  async (args) => {
    const auth = checkAuth(args)
    if (!auth.ok) return authError(auth.error)

    try {
      const health = await dbHealth()
      return okResult({ status: 'ok', db: health })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ status: 'error', db: { ok: false }, message }),
          },
        ],
        isError: true,
      }
    }
  }
)

// ---------------------------------------------------------------------------
// Tool: siapajar_list_schools
// ---------------------------------------------------------------------------

server.registerTool(
  'siapajar_list_schools',
  {
    description: 'Return a list of schools registered in SiapAjar.',
    inputSchema: z.object({
      ...API_KEY_PARAM,
      limit: z
        .number()
        .int()
        .min(1)
        .max(200)
        .default(50)
        .describe('Maximum number of rows to return (1-200, default 50)'),
    }),
  },
  async (args) => {
    const auth = checkAuth(args)
    if (!auth.ok) return authError(auth.error)

    try {
      const schools = await listSchools(args.limit)
      return okResult({ count: schools.length, schools })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
        isError: true,
      }
    }
  }
)

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)

  const shutdown = async () => {
    await server.close()
    await closePool()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
