import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createInterface, type Interface } from 'node:readline'
import env from '#start/env'

export class CodexServiceError extends Error {}

type JsonRpcMessage = {
  id?: number
  method?: string
  result?: unknown
  error?: { message?: string }
  params?: Record<string, any>
}

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

type CodexAccount = {
  type?: string
  email?: string | null
  planType?: string | null
}

class CodexAppServerClient {
  private process: ChildProcessWithoutNullStreams | null = null
  private readline: Interface | null = null
  private initialized = false
  private nextId = 1
  private readonly pending = new Map<number, PendingRequest>()
  private readonly notificationHandlers = new Set<(message: JsonRpcMessage) => void>()

  private async ensureStarted() {
    if (this.process && this.initialized) return

    const binary = env.get('CODEX_CLI_PATH') || 'codex'
    const child = spawn(binary, ['app-server', '--stdio'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    this.process = child
    this.initialized = false
    this.readline = createInterface({ input: child.stdout })
    this.readline.on('line', (line) => this.handleLine(line))
    child.stderr.on('data', () => undefined)
    child.once('error', (error) =>
      this.failAll(new CodexServiceError(`Codex tidak dapat dijalankan: ${error.message}`))
    )
    child.once('exit', () => {
      this.failAll(
        new CodexServiceError(
          'Proses Codex berhenti. Pastikan Codex CLI terpasang dan sudah login.'
        )
      )
      this.process = null
      this.readline?.close()
      this.readline = null
      this.initialized = false
    })

    await this.requestRaw('initialize', {
      clientInfo: { name: 'siapajar', title: 'SiapAjar', version: '1.0.0' },
      capabilities: { optOutNotificationMethods: ['item/agentMessage/delta'] },
    })
    this.send({ method: 'initialized' })
    this.initialized = true
  }

  private handleLine(line: string) {
    if (!line.trim()) return
    let message: JsonRpcMessage
    try {
      message = JSON.parse(line) as JsonRpcMessage
    } catch {
      return
    }

    if (typeof message.id === 'number') {
      const pending = this.pending.get(message.id)
      if (!pending) return
      clearTimeout(pending.timer)
      this.pending.delete(message.id)
      if (message.error) {
        pending.reject(new CodexServiceError(message.error.message || 'Codex mengembalikan error.'))
      } else {
        pending.resolve(message.result)
      }
      return
    }

    for (const handler of this.notificationHandlers) handler(message)
  }

  private send(message: Record<string, unknown>) {
    if (!this.process?.stdin.writable) {
      throw new CodexServiceError('Proses Codex belum siap.')
    }
    this.process.stdin.write(`${JSON.stringify(message)}\n`)
  }

  private requestRaw(method: string, params?: Record<string, unknown>): Promise<any> {
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new CodexServiceError(`Codex tidak merespons untuk ${method}.`))
      }, 45_000)
      this.pending.set(id, { resolve, reject, timer })
      this.send({ method, id, ...(params ? { params } : {}) })
    })
  }

  private async request(method: string, params?: Record<string, unknown>) {
    await this.ensureStarted()
    return this.requestRaw(method, params)
  }

  private failAll(error: Error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
  }

  async startChatGptLogin() {
    const result = (await this.request('account/login/start', { type: 'chatgpt' })) as {
      authUrl?: string
    }
    if (!result.authUrl) throw new CodexServiceError('Codex tidak mengembalikan URL login ChatGPT.')
    return result.authUrl
  }

  async account() {
    const result = (await this.request('account/read', { refreshToken: true })) as {
      account?: CodexAccount | null
    }
    return result.account || null
  }

  async models() {
    const result = (await this.request('model/list', { includeHidden: false })) as {
      data?: Array<{ id?: string; slug?: string; model?: string }>
      models?: Array<{ id?: string; slug?: string; model?: string }>
    }
    const entries = result.data || result.models || []
    return entries
      .map((entry) => entry.id || entry.slug || entry.model)
      .filter((model): model is string => Boolean(model))
  }

  async generate(systemPrompt: string, userPrompt: string, model?: string | null) {
    await this.ensureStarted()
    const threadResult = (await this.requestRaw('thread/start', {
      model: model || undefined,
      approvalPolicy: 'never',
      sandbox: 'read-only',
      ephemeral: true,
    })) as { thread?: { id?: string } }
    const threadId = threadResult.thread?.id
    if (!threadId) throw new CodexServiceError('Codex tidak membuat thread baru.')

    let responseText = ''
    let activeTurnId: string | undefined
    const completed = new Promise<void>((resolve, reject) => {
      let isDone = false
      const finish = (callback: () => void) => {
        if (isDone) return
        isDone = true
        this.notificationHandlers.delete(handler)
        callback()
      }

      const handler = (message: JsonRpcMessage) => {
        const params = message.params || {}
        if (
          message.method === 'turn/started' &&
          (params.turn?.threadId === threadId || params.threadId === threadId) &&
          typeof params.turn?.id === 'string'
        ) {
          activeTurnId = params.turn.id
        }

        const isMatchingTurn =
          (activeTurnId && params.turn?.id === activeTurnId) ||
          params.turn?.threadId === threadId ||
          params.threadId === threadId

        if (message.method === 'turn/completed' && isMatchingTurn) {
          if (params.turn?.status === 'failed') {
            const raw = params.turn?.error?.message || 'Codex gagal menyelesaikan permintaan.'
            let messageStr = raw
            try {
              const parsed = JSON.parse(raw)
              if (parsed?.error?.message) messageStr = parsed.error.message
            } catch {}
            finish(() => reject(new CodexServiceError(messageStr)))
          } else {
            finish(() => resolve())
          }
        }

        if (
          (message.method === 'item/completed' ||
            message.method === 'item/agentMessage/completed') &&
          (params.threadId === threadId || isMatchingTurn)
        ) {
          const item = params.item || {}
          if (typeof item.text === 'string' && item.text.trim()) {
            responseText = item.text
          } else if (Array.isArray(item.content)) {
            const contentText = item.content
              .map((c: any) => (typeof c === 'string' ? c : c?.text || ''))
              .join('')
            if (contentText.trim()) responseText = contentText
          }
        }

        if (
          (message.method === 'item/agentMessage/delta' || message.method === 'item/delta') &&
          (params.threadId === threadId || isMatchingTurn)
        ) {
          if (typeof params.delta === 'string') responseText += params.delta
          else if (typeof params.delta?.text === 'string') responseText += params.delta.text
        }
      }

      this.notificationHandlers.add(handler)
      setTimeout(() => {
        finish(() =>
          reject(new CodexServiceError('Codex tidak menyelesaikan generate dalam waktu wajar.'))
        )
      }, 90_000)
    })

    const turnResult = (await this.requestRaw('turn/start', {
      threadId,
      model: model || undefined,
      approvalPolicy: 'never',
      input: [{ type: 'text', text: `${systemPrompt}\n\n${userPrompt}` }],
    })) as { turn?: { id?: string } }
    activeTurnId = turnResult.turn?.id
    if (!activeTurnId) throw new CodexServiceError('Codex tidak memulai turn.')
    await completed
    if (!responseText.trim()) throw new CodexServiceError('Codex tidak mengembalikan konten.')
    return responseText
  }

  async generateImage(prompt: string, model?: string | null) {
    await this.ensureStarted()
    const threadResult = (await this.requestRaw('thread/start', {
      model: model || undefined,
      approvalPolicy: 'never',
      sandbox: 'read-only',
      ephemeral: true,
    })) as { thread?: { id?: string } }
    const threadId = threadResult.thread?.id
    if (!threadId) throw new CodexServiceError('Codex tidak membuat thread gambar baru.')

    let imageResult: string | undefined
    let activeTurnId: string | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    const completed = new Promise<void>((resolve, reject) => {
      const finish = (callback: () => void) => {
        if (timeout) clearTimeout(timeout)
        this.notificationHandlers.delete(handler)
        callback()
      }
      const handler = (message: JsonRpcMessage) => {
        const params = message.params || {}
        if (
          message.method === 'turn/started' &&
          params.turn?.threadId === threadId &&
          typeof params.turn?.id === 'string'
        ) {
          activeTurnId = params.turn.id
        }
        if (message.method === 'item/completed' && params.item?.type === 'image_generation_call') {
          const result = params.item.result
          if (typeof result === 'string' && result.trim()) imageResult = result
        }
        if (message.method === 'turn/completed' && params.turn?.id === activeTurnId) {
          if (params.turn?.status === 'failed') {
            finish(() =>
              reject(
                new CodexServiceError(
                  params.turn?.error?.message || 'Codex gagal membuat ilustrasi.'
                )
              )
            )
          } else {
            finish(resolve)
          }
        }
      }
      this.notificationHandlers.add(handler)
      timeout = setTimeout(() => {
        this.notificationHandlers.delete(handler)
        reject(new CodexServiceError('Codex tidak menyelesaikan pembuatan ilustrasi.'))
      }, 120_000)
    })

    const turnResult = (await this.requestRaw('turn/start', {
      threadId,
      model: model || undefined,
      approvalPolicy: 'never',
      input: [
        {
          type: 'text',
          text: `Use GPT Image 2 image generation for this request. Return one generated image asset, no explanation: ${prompt}`,
        },
      ],
    })) as { turn?: { id?: string } }
    activeTurnId = turnResult.turn?.id
    if (!activeTurnId) throw new CodexServiceError('Codex tidak memulai turn gambar.')
    await completed
    if (!imageResult) throw new CodexServiceError('Codex tidak mengembalikan asset gambar.')
    return normalizeImageResult(imageResult)
  }
}

async function normalizeImageResult(result: string) {
  const value = result.trim()
  if (value.startsWith('data:image/')) return value

  if (/^https?:\/\//i.test(value)) {
    const response = await fetch(value)
    if (!response.ok)
      throw new CodexServiceError('Codex mengembalikan URL gambar yang tidak dapat diunduh.')
    const mime = response.headers.get('content-type')?.split(';')[0] || 'image/png'
    const bytes = Buffer.from(await response.arrayBuffer())
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
      throw new CodexServiceError('Ukuran ilustrasi dari Codex tidak aman untuk disimpan.')
    }
    return `data:${mime};base64,${bytes.toString('base64')}`
  }

  const encoded = value.replaceAll(/\s/g, '')
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new CodexServiceError(
      'Codex mengembalikan asset gambar dalam format yang tidak didukung.'
    )
  }
  const bytes = Buffer.from(encoded, 'base64')
  if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
    throw new CodexServiceError('Ukuran ilustrasi dari Codex tidak aman untuk disimpan.')
  }
  return `data:image/png;base64,${encoded}`
}

const client = new CodexAppServerClient()

export function startCodexChatGptLogin() {
  return client.startChatGptLogin()
}

export function getCodexAccount() {
  return client.account()
}

export async function listCodexModels() {
  return client.models()
}

export function callCodex(systemPrompt: string, userPrompt: string, model?: string | null) {
  const normalizedModel = model && /^gpt-5\.6/i.test(model) ? 'gpt-5.5' : model || 'gpt-5.5'
  return client.generate(systemPrompt, userPrompt, normalizedModel)
}

export function generateCodexImage(prompt: string, model?: string | null) {
  return client.generateImage(prompt, model)
}
