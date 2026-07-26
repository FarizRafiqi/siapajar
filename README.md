# SiapAjar — Siap Ajar

All-in-one administrasi guru Kurikulum Merdeka. Siap mengajar, siap administrasi.

## Tech Stack

- **Backend:** AdonisJS 7 (Node.js/TypeScript), Lucid ORM
- **Frontend:** InertiaJS + React 19, HeroUI, Tailwind CSS 4, Framer Motion
- **Database:** PostgreSQL
- **AI generation:** 9router / OpenAI / Anthropic (configurable via admin panel)
- **Export:** DOCX (`docx`) + XLSX (`xlsx`)
- **Typed API client:** Tuyau

### Planned integrations (not yet implemented)

These are referenced in `.env.example` / the product roadmap but have no code wired up yet:

- **Payment:** Xendit
- **WhatsApp notifications:** Baileys
- **Background queue:** BullMQ + Redis

## Quick Start

### 1. Set up PostgreSQL

Create a local Postgres database (no `docker-compose.yml` is provided yet — use a local Postgres install, or run your own container):

```bash
createdb siapajar
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
├── Dockerfile                # production build image
└── PRD-SiapAjar.md          # Product Requirements Document
```

## Environment Variables

See `.env.example` for the full list.

Required:

- `APP_KEY` — generate with `node ace generate:key`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` — PostgreSQL connection

Optional (only needed for specific features):

- `ROUTER_API_KEY`, `ROUTER_API_URL` — AI generation via 9router/OpenAI/Anthropic-compatible endpoint
- `XENDIT_KEY` — payment integration (not yet implemented in code)
- `REDIS_HOST`, `REDIS_PORT`, `WA_SESSION_DIR` — reserved for planned queue/WhatsApp integrations (not yet implemented)

## License

Proprietary / unlicensed (see `package.json`). No public license is granted.
