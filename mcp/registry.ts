import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { API_KEY_PARAM, checkAuthAndAuthorize, authError, okResult } from './auth.js'
import db from '@adonisjs/lucid/services/db'

import { registerAdminTools } from './tools/admin.js'
import { registerDocumentTools } from './tools/documents.js'
import { registerAssessmentTools } from './tools/assessments.js'
import { registerCurriculumTools } from './tools/curriculum.js'

export function registerAllTools(server: McpServer) {
  // Health check tool
  server.registerTool(
    'siapajar_health',
    {
      description: 'Check database connectivity and report server health.',
      inputSchema: z.object(API_KEY_PARAM),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'health',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const start = Date.now()
        await db.rawQuery('SELECT 1')
        const latency = Date.now() - start
        return okResult({ status: 'ok', db: { ok: true, latency_ms: latency } })
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

  // Group A, B, C, D
  registerAdminTools(server)
  registerDocumentTools(server)
  registerAssessmentTools(server)
  registerCurriculumTools(server)
}
