# SiapAjar — Siap Ajar

All-in-one administrasi guru Kurikulum Merdeka. Siap mengajar, siap administrasi.

## Tech Stack

- **Backend:** AdonisJS 7 (Node.js)
- **Frontend:** InertiaJS + Vue 3
- **UI:** Tailwind CSS
- **Database:** PostgreSQL 16 (Docker)
- **Queue:** BullMQ + Redis (Docker)
- **AI:** 9router (9router.com)
- **Payment:** Xendit
- **WhatsApp:** Baileys
- **Export:** DOCX + PDF

## Quick Start

### 1. Start Docker services

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — fill DB_PASSWORD, APP_KEY, ROUTER_API_KEY, etc.
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
├── app/                  # Controllers, models, services, middleware
├── config/               # Database, auth, etc.
├── database/migrations/  # Lucid migrations
├── inertia/              # Vue 3 pages, components, layouts
│   ├── pages/            # Page components
│   ├── components/       # Reusable components
│   ├── composables/      # Vue composables
│   └── stores/           # Pinia stores
├── providers/            # Service providers
├── start/                # Routes, env, kernel
├── docker-compose.yml    # PostgreSQL + Redis
├── Dockerfile            # Production build
└── PRD-GuruAllInOne.md   # Product Requirements Document
```

## Environment Variables

See `.env.example` for full list.

Required:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
- `REDIS_HOST`, `REDIS_PORT`

Optional (for specific features):
- `ROUTER_API_KEY` — 9router.com API key
- `XENDIT_KEY` — Xendit payment API key
