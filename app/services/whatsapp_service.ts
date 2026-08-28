import fs from 'node:fs'
import path from 'node:path'
import pino from 'pino'
import makeWASocket, { useMultiFileAuthState, DisconnectReason, type WASocket } from 'baileys'
import env from '#start/env'
import { normalizeIndonesianPhone } from '#services/whatsapp_phone'

const getSessionBaseDir = () => env.get('WA_SESSION_DIR') || './wa-session'

const userSockets = new Map<number, WASocket>()
const userQRs = new Map<number, string>()
const initializingSockets = new Map<number, Promise<WASocket>>()

function getUserSessionDir(userId: number): string {
  const baseDir = getSessionBaseDir()
  const userDir = path.resolve(baseDir, String(userId))
  return userDir
}

export function getStatus(userId: number): { paired: boolean; phone?: string } {
  const userDir = getUserSessionDir(userId)
  const credsFile = path.join(userDir, 'creds.json')

  if (!fs.existsSync(credsFile)) {
    return { paired: false }
  }

  try {
    const raw = fs.readFileSync(credsFile, 'utf-8')
    const creds = JSON.parse(raw)
    if (creds && creds.registered) {
      const meId = creds.me?.id || ''
      const phone = meId.split(':')[0] || meId.split('@')[0]
      return { paired: true, phone: phone || undefined }
    }
  } catch {
    // ignore parse error
  }

  return { paired: false }
}

async function getOrInitSocket(userId: number): Promise<WASocket> {
  const existing = userSockets.get(userId)
  if (existing) {
    return existing
  }

  const initializing = initializingSockets.get(userId)
  if (initializing) {
    return initializing
  }

  const initPromise = (async () => {
    const userDir = getUserSessionDir(userId)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    const { state, saveCreds } = await useMultiFileAuthState(userDir)

    const logger = pino({ level: 'silent' })

    const sock = makeWASocket({
      auth: state,
      logger: logger as any,
      printQRInTerminal: false,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update
      if (qr) {
        userQRs.set(userId, qr)
      }
      if (connection === 'open') {
        userQRs.delete(userId)
      } else if (connection === 'close') {
        userQRs.delete(userId)
        userSockets.delete(userId)
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
        if (statusCode === DisconnectReason.loggedOut) {
          logout(userId).catch(() => {})
        }
      }
    })

    userSockets.set(userId, sock)
    return sock
  })()

  initializingSockets.set(userId, initPromise)
  try {
    const sock = await initPromise
    return sock
  } finally {
    initializingSockets.delete(userId)
  }
}

export async function pair(userId: number): Promise<{ qr?: string; status: string }> {
  const statusInfo = getStatus(userId)
  if (statusInfo.paired) {
    return { status: 'already-paired' }
  }

  await getOrInitSocket(userId)

  if (userQRs.has(userId)) {
    return { qr: userQRs.get(userId), status: 'pairing' }
  }

  // Wait briefly for QR code event
  await new Promise<void>((resolve) => {
    let checkCount = 0
    const interval = setInterval(() => {
      checkCount++
      if (userQRs.has(userId) || getStatus(userId).paired || checkCount > 20) {
        clearInterval(interval)
        resolve()
      }
    }, 250)
  })

  const currentStatus = getStatus(userId)
  if (currentStatus.paired) {
    return { status: 'already-paired' }
  }

  return {
    qr: userQRs.get(userId),
    status: 'pairing',
  }
}

export async function logout(userId: number): Promise<void> {
  const sock = userSockets.get(userId)
  if (sock) {
    try {
      sock.end(undefined)
    } catch {}
    userSockets.delete(userId)
  }
  userQRs.delete(userId)

  const userDir = getUserSessionDir(userId)
  if (fs.existsSync(userDir)) {
    try {
      fs.rmSync(userDir, { recursive: true, force: true })
    } catch {}
  }
}

export async function sendDocument(
  userId: number,
  phone: string,
  buffer: Buffer,
  filename: string,
  caption: string
): Promise<void> {
  const normalized = normalizeIndonesianPhone(phone)
  if (!normalized) {
    throw new Error('Nomor HP orang tua tidak valid atau belum diisi.')
  }

  const statusInfo = getStatus(userId)
  if (!statusInfo.paired) {
    throw new Error('WhatsApp belum terhubung (pairing). Silakan ke menu WhatsApp dulu.')
  }

  try {
    const sock = await getOrInitSocket(userId)

    const jid = `${normalized}@s.whatsapp.net`
    await sock.sendMessage(jid, {
      document: buffer,
      fileName: filename,
      caption,
      mimetype: 'application/pdf',
    })
  } catch (error) {
    throw new Error(`Gagal mengirim WhatsApp: ${(error as Error).message || 'terjadi kesalahan'}`)
  }
}
