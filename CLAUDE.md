# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server with HMR (port 3333)
npm run build        # production build (AdonisJS + Vite)
npm run lint         # eslint .
npm run format       # prettier --write .
npm run typecheck    # tsc --noEmit
npm test             # full Japa test suite

# Run a single test file
node ace test --files tests/unit/my_service.spec.ts
node ace test --files tests/functional/my_controller.spec.ts

# Database
node ace migration:run
node ace migration:rollback
node ace db:seed --files database/seeders/curriculum_seeder.ts

# Background worker (Redis-backed in production, sync in dev/CI)
node ace queue:work
```

CI runs: lint → typecheck → test → build against Postgres 16. Set `QUEUE_DRIVER=sync` when Redis is unavailable.

## Architecture

**SiapAjar** is an AdonisJS 7 (ESM, TypeScript) monolith serving a React 19 SPA via InertiaJS. There is no REST/GraphQL API — Inertia delivers server-rendered page props as JSON into React components. The Tuyau library (`@tuyau/core`) generates a type-safe client from AdonisJS routes; the generated output lives in `.adonisjs/client/` and is imported via the `@generated` alias.

```
Browser (React 19 + HeroUI + Tailwind v4)
        ↕  InertiaJS (XHR page props)
AdonisJS HTTP Server  (:3333)
  ├── Middleware: container_bindings → static → CORS → Vite → Inertia →
  │              bodyparser → session → shield(CSRF) → auth → silent_auth
  ├── start/routes.ts       — all route definitions
  ├── app/controllers/      — 27 controllers (index/show/store/update/destroy + .generate/.export)
  ├── app/models/           — 22 Lucid active-record models (PostgreSQL via pg)
  ├── app/services/         — business logic (see below)
  ├── app/validators/       — VineJS request validators
  ├── app/middleware/        — auth, guest, role, onboarding, silent_auth
  └── app/jobs/             — generate_narratives.ts (queued AI job)
PostgreSQL  ←  Lucid ORM
Redis       ←  @adonisjs/queue + @adonisjs/redis
```

**Frontend** (`inertia/`):
- `inertia/app.tsx` — Inertia + Tuyau bootstrap
- `inertia/pages/` — one `.tsx` per route, organized by feature domain
- `inertia/layouts/dashboard.tsx` — sidebar + header shell wrapping all authenticated pages
- `inertia/client.ts` — Tuyau typed API client used for form submissions and route URLs

**Path aliases:** `~/` → `inertia/`, `@generated` → `.adonisjs/client/`

### Key Services (`app/services/`)

| Service | Responsibility |
|---|---|
| `ai_service.ts` | Multi-provider LLM dispatch (9router / OpenAI / Anthropic / Gemini); provider chosen from `ai_settings` DB row |
| `ai_queue_service.ts` | Enqueues AI jobs to `@adonisjs/queue` for async processing |
| `export_service.ts` / `xlsx_export_service.ts` / `pdf_export_service.ts` | Document generation (DOCX via `docx`, Excel via `exceljs`, PDF via `pdfkit`) |
| `entitlement_service.ts` | Package/feature gating by `user.package_id` |
| `curriculum_context_service.ts` | PAUD curriculum helpers (CP → TP → ATP → IKTP chain) |
| `report_card_service.ts` | Narrative report generation |
| `student_import_service.ts` | Bulk student import |

### Domain Model

The app targets Indonesian early childhood education (PAUD: TK/RA) under Kurikulum Merdeka:

- **Users** have a `role` (`admin` / `guru` / `kepala_sekolah` / `orang_tua`), belong to a `school`, and hold a `package_id` for entitlements.
- `institution_type` (`tk` / `ra`) and `curriculum_version` drive which curriculum content is available.
- PAUD curriculum chain: `curriculum_cps` → `learning_objectives` → `learning_sequences` → `iktp_indicators` → `paud_assessments` → `report_narratives`.
- `default_group_context` (`a` / `b`) selects Kelompok A or B for lesson plans.

### Route Conventions

- AI generation: `POST /resource/generate` (or `POST /resource/:id/generate`)
- Export: `GET /resource/:id/export` (DOCX), `GET /resource/:id/export-pdf`
- Admin-only: `/admin/*` (role middleware: `admin`)
- Principal read-only: `/principal/*` (role middleware: `kepala_sekolah`)
- New users are forced through `/onboarding` before any dashboard route (enforced by `onboarding_middleware`).

### Auth

Session-based auth (`@adonisjs/auth` web guard) with remember-me tokens. Google OAuth via `@adonisjs/ally`. CSRF shield active on all non-GET routes.
