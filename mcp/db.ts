import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  pool ??= new Pool({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'siapajar',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'siapajar',
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })
  return pool
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export interface SchoolRow {
  id: number
  name: string
  npsn: string | null
  created_at: Date
}

export async function dbHealth(): Promise<{ ok: boolean; latency_ms: number }> {
  const client = await getPool().connect()
  const start = Date.now()
  try {
    await client.query('SELECT 1')
    return { ok: true, latency_ms: Date.now() - start }
  } finally {
    client.release()
  }
}

export async function listSchools(limit: number): Promise<SchoolRow[]> {
  const result = await getPool().query<SchoolRow>(
    'SELECT id, name, npsn, created_at FROM schools ORDER BY id LIMIT $1',
    [limit]
  )
  return result.rows
}
