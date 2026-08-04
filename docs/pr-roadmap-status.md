# PR 0–10 implementation status

This document maps the roadmap to the current code so the product contract remains explicit.

| PR | Implemented foundation |
|---|---|
| 0 | RA/TK institution profile, curriculum version, default A/B group, controlled CP library, and contract `CP → TP → ATP → IKTP/evidence → report`. |
| 1 | Existing onboarding, ownership checks, CSV/XLSX import, semester fallback, and dashboard tutorial; onboarding now captures RA/TK and A/B context. |
| 2 | Existing landing claims remain conservative; future integrations remain marked as planned in README. |
| 3 | CP/TP/ATP page, official Fase Fondasi seed, custom TP, ATP ordering, and user-owned ATP persistence. |
| 4 | Curriculum IDs are available for document/assessment linking; existing document JSON remains backward compatible. |
| 5 | IKTP indicator/evidence data model and PAUD assessment linkage, including status and teacher notes. |
| 6 | Per-element editable narrative drafts and approval status; PAUD report flow avoids numeric ranking. |
| 7 | Package entitlements, monthly usage events, and class quota enforcement; payment remains out of scope. |
| 8 | Official `@adonisjs/queue` v0.6.2 with the documented `@adonisjs/redis` v10 adapter, retry/backoff, concurrency, worker discovery, and native Redis configuration. Batch narrative generation uses the official worker. Interactive document generation still uses the existing in-process concurrency service and is the remaining queue migration item. The project does not require Docker. |
| 9 | CI workflow and curriculum/ownership tests are present; typecheck and build pass. Full lint currently exposes 912 legacy formatting/style findings across the existing repository, and the local Japa runner is blocked by the environment's `os.networkInterfaces()` error, so this gate is not yet green. |
| 10 | Native PostgreSQL/Redis setup documentation, AdonisJS Redis/Queue configuration, env examples, curriculum seed, CI, and health checks. |

The existing unrelated untracked upload/cache files are intentionally preserved.
