import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import { z } from 'zod'
import McpKey from '#models/mcp_key'
import type User from '#models/user'

export type McpRole = 'admin' | 'guru' | 'kepala_sekolah'

export type McpContext = {
  key: McpKey
  user: User
  role: McpRole
  schoolId: number | null
  scopes: string[] | null
}

export type ToolMeta = {
  roles: McpRole[]
  scope?: 'any' | 'school' | 'own'
  group?: string
  destructive?: boolean
}

export const API_KEY_PARAM = {
  api_key: z.string().describe('Per-user MCP API key'),
}

export function authError(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
    isError: true,
  }
}

export function okResult(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  }
}

export function errorResult(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
    isError: true,
  }
}

export async function resolveMcpContext(
  apiKey: string
): Promise<{ ok: true; context: McpContext } | { ok: false; error: string }> {
  if (!apiKey) {
    return { ok: false, error: 'API key is required.' }
  }

  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')
  const mcpKey = await McpKey.query()
    .where('key_hash', keyHash)
    .whereNull('revoked_at')
    .preload('user', (q) => q.preload('school'))
    .first()

  if (!mcpKey || !mcpKey.user) {
    return { ok: false, error: 'Invalid or revoked API key.' }
  }

  mcpKey.lastUsedAt = DateTime.now()
  mcpKey.save().catch(() => {})

  return {
    ok: true,
    context: {
      key: mcpKey,
      user: mcpKey.user,
      role: (mcpKey.user.role as McpRole) || 'guru',
      schoolId: mcpKey.user.schoolId,
      scopes: mcpKey.scopes,
    },
  }
}

export function authorize(
  meta: ToolMeta,
  ctx: McpContext,
  args?: Record<string, any>
): { ok: true } | { ok: false; error: string } {
  if (!meta.roles.includes(ctx.role)) {
    return {
      ok: false,
      error: `Forbidden: Requires one of roles [${meta.roles.join(', ')}]. Your role is '${ctx.role}'.`,
    }
  }

  if (ctx.scopes && meta.group && !ctx.scopes.includes(meta.group)) {
    return {
      ok: false,
      error: `Forbidden: Key scope does not allow access to '${meta.group}' tools.`,
    }
  }

  if (meta.destructive && (!args || args.confirm !== true)) {
    return {
      ok: false,
      error: `Confirmation required: Set 'confirm: true' to perform this action.`,
    }
  }

  return { ok: true }
}

export async function checkAuthAndAuthorize(
  args: { api_key: string; [key: string]: any },
  meta: ToolMeta
): Promise<{ ok: true; ctx: McpContext } | { ok: false; error: string }> {
  const auth = await resolveMcpContext(args.api_key)
  if (!auth.ok) {
    return { ok: false, error: auth.error }
  }

  const authed = authorize(meta, auth.context, args)
  if (!authed.ok) {
    return { ok: false, error: authed.error }
  }

  return { ok: true, ctx: auth.context }
}
