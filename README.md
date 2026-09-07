# SiapAjar — Siap Ajar

All-in-one administrasi guru Kurikulum Merdeka. Siap mengajar, siap administrasi.

## Tech Stack

- **Backend:** AdonisJS 7 (Node.js/TypeScript), Lucid ORM
- **Frontend:** InertiaJS + React 19, HeroUI, Tailwind CSS 4, Framer Motion
- **Database:** PostgreSQL
- **AI generation:** 9router / OpenAI / Gemini / Anthropic / OpenAI-compatible aggregators (configurable via admin panel)
- **Visual assets:** Lucide-style outline registry, sanitized SVG generation, and raster image jobs stored in `visual_assets`
- **Export:** Canonical RA/TK worksheet preview + PDF (Playwright Chromium) + DOCX (`docx`) + XLSX (`xlsx`)
- **Typed API client:** Tuyau

### Planned integrations (not yet implemented)

These are referenced in `.env.example` / the product roadmap but have no code wired up yet:

- **Payment:** Xendit
- **WhatsApp notifications:** Baileys

## Quick Start

### 1. Set up PostgreSQL and Redis natively

Install PostgreSQL and Redis using the native packages for your operating system, then make sure both services listen on their default local ports. AdonisJS Lucid owns the PostgreSQL connection and `@adonisjs/redis` owns the Redis connection; there is no Docker requirement.

```bash
# Verify native services
psql --version
redis-cli ping
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — fill APP_KEY, DB_* (Postgres credentials), and any optional keys you need
```

Generate an `APP_KEY` with:

```bash
node ace generate:key
```

### 4. Run migrations

```bash
node ace migration:run
```

### 5. Start dev server

```bash
npm run dev
```

Open http://localhost:3333

For local development without a Redis worker, set `QUEUE_DRIVER=sync`. For production or a shared environment, set `QUEUE_DRIVER=redis` and run the worker in a separate process:

```bash
npm run queue:work
```

The credit balance reconciliation runs once daily at 03:15 Asia/Jakarta on the
`maintenance` queue. Run `npm run queue:work:maintenance` separately when a
dedicated maintenance worker is preferred.

To run a one-time reconciliation after a deployment or data repair, use:

```bash
node ace credits:sync-balances
```

Exam PDF export uses Playwright Chromium so print preview, PDF, and DOCX follow the same worksheet contract. On a native Debian/Ubuntu host, install the browser once before starting the app:

```bash
npx playwright install --with-deps chromium
```

If Chromium is managed outside Playwright, set `PDF_BROWSER_EXECUTABLE_PATH` to its executable path. PDF export releases its quota reservation when the browser is unavailable and reports the failure without charging the user.

The included Dockerfile installs Chromium and its runtime libraries automatically. This is only the application runtime; PostgreSQL and Redis can remain native services/DBNGIN services as documented above.

## Project Structure

```
siapajar/
├── app/
│   ├── controllers/      # HTTP controllers
│   ├── middleware/        # auth, role, onboarding middleware
│   ├── models/            # Lucid models
│   ├── services/          # export services (docx/xlsx), AI generation, etc.
│   └── validators/        # VineJS request validators
├── config/                # auth, database, session, etc.
├── database/
│   ├── migrations/        # Lucid migrations
│   └── seeders/
├── inertia/                # React frontend (Inertia.js)
│   ├── pages/              # Page components (one folder per feature)
│   ├── components/         # Reusable components
│   └── layouts/
├── providers/               # AdonisJS service providers
├── start/                   # routes.ts, kernel.ts, env.ts
├── docs/                    # roles-and-permissions.md, etc.
├── Dockerfile                # optional production image; local setup does not require Docker
└── PRD-SiapAjar.md          # Product Requirements Document
```

## Environment Variables

See `.env.example` for the full list.

Required:

- `APP_KEY` — generate with `node ace generate:key`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` — PostgreSQL connection

Optional (only needed for specific features):

- `ROUTER_API_KEY`, `ROUTER_API_URL` — AI generation only when the 9router card is selected
- `COMMAND_CODE_API_KEY`, `OPENROUTER_API_KEY`, `OPENCODE_ZEN_API_KEY`, `TOGETHER_API_KEY` — provider-specific aggregator keys; the active gateway is selected in admin AI settings and an admin-saved key takes precedence
- `AGGREGATOR_API_KEY` — legacy shared fallback for existing deployments; provider-specific keys are recommended
- `CODEX_CLI_PATH` — optional path to the official Codex CLI for direct OpenAI ChatGPT OAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_OAUTH_PROJECT_ID` — direct Gemini Google OAuth; add the callback URL from `.env.example` to the Google OAuth client
- `XENDIT_KEY` — reserved for payment integration; billing is intentionally outside the beta scope
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `QUEUE_DRIVER`, `AI_QUEUE_*`, `WA_SESSION_DIR` — queue/WhatsApp configuration

## Kurikulum RA/TK

The curriculum flow is intentionally controlled around one shared PAUD Fase Fondasi CP library:

`CP → TP → ATP → IKTP/evidence → narrative report`

CP is seeded as reference data. Teachers can create custom TP, arrange an ATP for Kelompok A/B, define observable IKTP criteria, attach assessment evidence, and edit/approve narrative report drafts. TK and RA are stored as institution profiles; they do not duplicate CP data.

Run the curriculum seed after migrations:

```bash
node ace db:seed --files database/seeders/curriculum_seeder.ts
```

Start the AdonisJS queue worker in a separate terminal:

```bash
node ace queue:work
```

Check the native services through the application health endpoint:

```bash
curl http://localhost:3333/health
```

The official AdonisJS queue package documents Redis as the production adapter and Sync as the development/test adapter. Redis is configured in `config/redis.ts`; queue behavior is configured in `config/queue.ts`. No `docker-compose` file is required by this project.

## License

Proprietary / unlicensed (see `package.json`). No public license is granted.
