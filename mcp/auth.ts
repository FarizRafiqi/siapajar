import { z } from 'zod'
import User from '#models/user'

export const API_KEY_PARAM = {
  api_key: z.string().describe('API key (must match SIAPAJAR_MCP_API_KEY)'),
}

export type AuthedArgs = { api_key: string }

export function checkAuth(args: AuthedArgs): { ok: true } | { ok: false; error: string } {
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

export async function getEffectiveUser(userId?: number): Promise<User> {
  if (userId) {
    const user = await User.find(userId)
    if (user) return user
  }
  const admin = await User.query().where('role', 'admin').first()
  if (admin) return admin
  const anyUser = await User.first()
  if (anyUser) return anyUser
  throw new Error('No user found in application. Please seed or create a user first.')
}
