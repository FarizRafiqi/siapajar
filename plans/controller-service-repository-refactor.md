# SiapAjar Controller–Service–Repository Refactor Blueprint

**Status:** Ready for user review — planning only; implementation requires explicit approval.
**Generated:** 2026-08-29
**Working branch:** `refactor/controller-service-repository`
**Comparison baseline:** current `HEAD` (`3aa6b07`), not `origin/main`; the branch already contains the unmerged Express/Mayar/UI work.

## Objective

Refactor the backend without changing behavior or any HTTP/API contract:

- Controllers are lean HTTP adapters: authenticate, validate request input, call an application service, and translate the result to Inertia/JSON/redirect responses.
- Services own use-case orchestration, business rules, domain decisions, external integrations, and response DTO/view-model assembly.
- A short, single-model query may remain in a service when it is genuinely simple.
- Complex, long, repeated, relation-heavy, aggregate, paginated, ownership-scoped, raw SQL, or transactional database work belongs in a concrete repository method.
- Services call named repository methods for that work; query builders must not leak into services or controllers.
- Existing export/rendering services remain responsible for document/file generation; repositories do not contain PDF, DOCX, XLSX, AI prompt, or presentation logic.
- No merge, push, route-definition/HTTP-contract change, UI change, copy change, schema change, or unrelated cleanup is included. The existing `/health` raw probe may be moved behind an infrastructure boundary without changing its route or response contract.

## Research snapshot

- The repository is an AdonisJS 7 / TypeScript / Lucid / PostgreSQL application with 35 backend controllers, 36 services, and 10 unit-spec files.
- `app/repositories/` exists but is empty. There is no repository import alias in `package.json`.
- The heaviest controllers are `weekly_lesson_plans_controller.ts` (744 lines), `paud_assessments_controller.ts` (638), `classes_controller.ts` (528), `curriculum_controller.ts` (363), and `express_tools_controller.ts` (357).
- Direct persistence/query usage is concentrated in the controllers: `dashboard_controller.ts` has roughly 43 detected database calls, `classes_controller.ts` 40, `paud_assessments_controller.ts` 38, and `curriculum_controller.ts` 38. These counts include model writes and are an inventory signal, not a semantic complexity score.
- Existing services with meaningful database access include `credit_service.ts`, `entitlement_service.ts`, `report_card_service.ts`, `weekly_assessment_loader.ts`, `curriculum_context_service.ts`, `mayar_service.ts`, `ai_queue_service.ts`, `exam_generation_service.ts`, `visual_asset_service.ts`, `ai_service.ts`, and `document_workflow_service.ts`.
- Existing tests are mostly pure/unit tests. There are no established controller, repository, or domain integration test suites for the CRUD flows.
- `mcp_controller.ts` has no database access and is intentionally unchanged; the `/health` route in `start/routes.ts` does contain a raw database probe and is handled explicitly in P13.
- `npm run typecheck` passes and `npm run lint` passes at the baseline.
- `npm test` currently fails before executing tests because the environment raises `uv_interface_addresses returned Unknown system error 1` from `os.networkInterfaces()` while Japa/get-port starts. This must be re-attempted in a normal test environment after each batch; it is not treated as a code regression unless the failure changes.
- `gh auth status` reports an invalid GitHub token. The plan therefore uses local branch/checkpoint workflow and does not assume PR/CI API access.

## Target layering contract

### Controller

Allowed responsibilities:

1. Read `HttpContext` values and perform request validation with the existing Vine validators.
2. Obtain the authenticated user and pass an explicit user/actor identifier to the service.
3. Call one application-service use case.
4. Select the existing HTTP response shape, redirect, flash message, or Inertia page.

Controllers must not import domain models for persistence, instantiate query builders, call `db`, own transactions, loop over database writes, or contain ownership/business orchestration. HTTP-specific filename/header handling may remain at the edge, while data retrieval and preparation moves to a service.

### Service

Services own business rules, orchestration across repositories/external providers, domain errors, idempotency decisions, and typed DTOs. A direct model query is allowed only when all of the following are true: one model, one short predicate, no relation preload, no aggregate, no pagination, no raw SQL, no transaction, and no repeated use-case-specific query composition. This exception must not be used to keep a complex query in place.

### Repository

Repositories own Lucid query construction, relation loading, ownership/scoping predicates that are part of a data access operation, aggregates, pagination queries, raw SQL, and atomic multi-write transactions. Methods are named after use cases/aggregates (for example `findOwnedWithAttachments`, `listDashboardMetrics`, or `replaceDefaultSubjects`), accept typed input, and return typed models/DTOs/results. Do not introduce a generic repository that only mirrors `Model.find/create/update/delete`, and do not return a query builder to callers.

Background jobs follow the same boundary. A trivial job lookup can remain a documented simple exception, but jobs must use services/repositories for relation-heavy, transactional, or repeated persistence. Pure AI, export, parser, formatter, and file-generation code does not belong in a repository.

### Planned project conventions

- Add the `#repositories/*` package import alias in `package.json`.
- Use concrete domain repositories under `app/repositories/`; use classes with explicit methods and injectable dependencies where practical, with a singleton only where it matches existing project style.
- Keep transaction ownership at the repository boundary. The service validates business inputs and interprets repository results/errors; it does not assemble transaction callbacks.
- Preserve Lucid model shapes required by existing export services until a later, separately approved DTO migration.
- Add static checks to prevent direct model/query/database imports from controllers and to flag complex query patterns in services.

## Dependency graph and execution order

```text
P0 Foundation and rule
├── P1 Auth/account/onboarding
├── P2 Admin/catalog/subjects
├── P3 Teacher/principal dashboards
├── P5 Curriculum
└── P6 Classes/students

P1 + P2 ──> P4 Billing/Mayar/credits/entitlements
P5 + P6 ──> P7 Annual/semester plans ──> P8 Weekly/daily plans
P4 + P6 + P8 ──> P9 Teaching/LKPD/media/express/document workflows
P6 ──> P10 Standard assessments
P8 + P10 ──> P11 PAUD assessments/report cards
P4 + P5 + P6 ──> P12 Exams and generation persistence
P1…P12 ──> P13 AI settings/background jobs/health and final gate
```

After P0, P1, P2, P3, P5, and P6 have mostly disjoint write sets and can be parallel workstreams. For a single working agent, execute them serially in numerical order. Do not run parallel implementation on shared controller/repository files.

## Construction steps

### P0 — Establish the contract and repository foundation

**Context brief:** The repository directory is empty and the project has no repository alias. Existing `AGENTS.md` contains project/UI rules but no backend layering rule. This step must not alter application behavior.

**Files/scope:** `AGENTS.md`, `package.json`, `app/repositories/`, optional repository test helpers only.

**Tasks:**

1. Add a concise “Backend Layering: Controller, Service, Repository” section to `AGENTS.md` using the contract above, including the simple-query exception and the prohibition on query builders leaking upward.
2. Add `#repositories/*` to the existing package import map without changing existing aliases.
3. Establish naming/return-type/transaction conventions in the plan or a small backend architecture note; do not create a speculative generic base repository.
4. Decide and document the test seam for repositories/services before domain work (repository fakes for service unit tests; database-backed integration/functional tests where query behavior matters).

**Verification:** `npm run typecheck`, `npm run lint`, `git diff --check`; confirm no controller/service behavior changed.

**Exit criteria:** The rule is present in `AGENTS.md`, `#repositories/*` resolves, and the repository contract is reviewable. Rollback is limited to reverting this foundation checkpoint.

### P1 — Extract auth, account, onboarding, settings, and public package access

**Context brief:** `session_controller.ts`, `new_account_controller.ts`, `google_auth_controller.ts`, `onboarding_controller.ts`, `settings_controller.ts`, and `home_controller.ts` directly use `User`, `Package`, `PackageSubscription`, or `School`. Google OAuth has security-sensitive verification, and login supports both browser and API responses.

**Files/scope:** The six controllers above; new account/auth/onboarding/settings application services as needed; concrete account/user, package, subscription, and school repository methods. Existing `creditService` remains a collaborator and is handled fully in P4.

**Tasks:**

1. Move free-package lookup, Google-id/email lookup, school case-insensitive lookup/create, subscription creation, and profile persistence behind named service/repository operations where they are multi-step or scoped.
2. Keep credential verification and HTTP content negotiation semantics unchanged.
3. Preserve OAuth state/error handling, verified-email guard, token payload shape, redirects, session flashes, and existing validator behavior.
4. Keep file upload/deletion edge handling in the settings use case/service; keep raw HTTP response work in the controller.

**Verification:** Add focused auth/onboarding/settings tests with fakes and functional tests when the test database is available; run `npm run typecheck`, `npm run lint`, and a static controller model/query scan.

**Exit criteria:** These controllers contain no persistence imports or database calls, and browser/API contracts are unchanged. Rollback by reverting only the P1 checkpoint.

### P2 — Extract admin catalog and subject management

**Context brief:** Small admin controllers still perform CRUD, duplicate checks, relation preloads, package assignment, and an 18-week preset reset loop. `subjects_controller.ts` deletes non-default subjects and upserts defaults in one request.

**Files/scope:** `admin_academic_years_controller.ts`, `admin_schools_controller.ts`, `admin_packages_controller.ts`, `admin_curriculum_presets_controller.ts`, `admin_entitlements_controller.ts`, `admin_users_controller.ts`, and `subjects_controller.ts`; admin/catalog/subject services and repositories.

**Tasks:**

1. Move list/detail/duplicate lookup and simple CRUD orchestration out of controllers.
2. Put preset filtering/upsert/reset and subject default replacement in named repository methods; keep the default data constants and validation semantics intact.
3. Make admin user package reassignment atomic at the repository boundary while preserving active-subscription cancellation and creation behavior.
4. Preserve admin redirects, flashes, role-self-protection, package/entitlement serialization, and all validator contracts.

**Verification:** Add tests for duplicate handling, default replacement, preset reset, entitlement upsert, and package reassignment; run typecheck/lint and targeted tests where available.

**Exit criteria:** No listed admin/subject controller directly imports a persistence model or database service; all multi-write operations have an explicit repository method and test coverage.

### P3 — Extract teacher and principal dashboard read models

**Context brief:** `dashboard_controller.ts` runs many parallel counts and recent-item queries and `principal_dashboard_controller.ts` combines teacher lists with grouped class/student counts. These are read-model aggregations, not controller responsibilities.

**Files/scope:** `dashboard_controller.ts`, `principal_dashboard_controller.ts`; `dashboard_repository.ts` (or explicitly separated teacher/principal read repositories); dashboard service/DTOs.

**Tasks:**

1. Create repository methods for teacher dashboard metrics, admin metrics, recent resources, principal teacher counts, and teacher detail data.
2. Keep role branching and presentation DTO assembly in a service; keep only HTTP rendering and redirects in controllers.
3. Preserve count scope (`user_id`, school, role), ordering, empty-school behavior, and JSON/Inertia payload keys.

**Verification:** Add repository integration tests for teacher/admin/principal scoping and empty results; add service DTO tests; run the standard checks.

**Exit criteria:** The 43-call dashboard aggregation and grouped principal queries are hidden behind repository methods, with no response-shape changes.

### P4 — Extract billing, Mayar, credits, and entitlements

**Context brief:** Billing spans `account_billing_controller.ts`, `mayar_payments_controller.ts`, `credit_service.ts`, `entitlement_service.ts`, and `mayar_service.ts`. It contains row locks, quota aggregates, pagination, idempotent webhook lookup, and credit ledger transactions.

**Files/scope:** The billing controllers/services above; billing, credit, entitlement, and invoice repositories. Do not change the Mayar HTTP integration contract.

**Tasks:**

1. Move invoice/subscription/usage read models and pagination into repository methods.
2. Move credit debit/add transactions, row locks, ledger writes, and signup-bonus eligibility lookup into a credit repository while keeping validation and domain errors in the service.
3. Move entitlement lookup, usage aggregate, reservation idempotency, quota locking, commit, and release persistence into an entitlement repository.
4. Move package selection/owned invoice lookup out of controllers; keep Mayar request construction, webhook verification, and idempotent domain decisions in the service.
5. Preserve date boundaries, status filters, metadata, invoice response fields, and exact credit/quota behavior under retries.

**Verification:** Add integration tests for insufficient balance, concurrent-safe debit/add, quota limit, reservation idempotency/release, duplicate webhook, invoice ownership, and pagination. Run typecheck/lint and targeted tests.

**Exit criteria:** No billing controller contains queries/transactions; all atomic database work is repository-owned; Mayar and credit contracts remain stable.

### P5 — Extract curriculum, seed/reset, and curriculum context access

**Context brief:** `curriculum_controller.ts` is both a CRUD controller and an orchestration script for CP/TP/ATP/IKTP seed/reset. It contains nested preloads, ownership checks, cascading deletes, and export data queries. `curriculum_context_service.ts` also composes relation-heavy queries.

**Files/scope:** `curriculum_controller.ts`, `curriculum_context_service.ts`, `curriculum_presets.ts` only where needed; `curriculum_repository.ts`; curriculum application service(s).

**Tasks:**

1. Move CP → objective → indicator read graphs, ownership-scoped lookups, and export data loading into repository methods.
2. Move seed, reset, cascading-delete, and preset persistence into explicit repository operations; preserve existing ordering and visibility of shared versus user-owned records.
3. Keep curriculum business rules, entitlement checks, preset selection, and flash/redirect decisions in the service/controller boundary.
4. Make `getCurriculumContext` call the repository rather than building relation queries itself.

**Verification:** Extend `curriculum_contract.spec.ts`; add tests for shared CP visibility, owned TP/ATP/IKTP boundaries, delete/reset semantics, and context output. Run typecheck/lint and targeted tests.

**Exit criteria:** Curriculum controller has no query helpers or seed loops; context service has no relation query construction; existing CP/TP/ATP/IKTP payloads remain compatible.

### P6 — Extract classes, students, attendance, and import persistence

**Context brief:** `classes_controller.ts` is a 528-line mixed read/write controller. It handles class ownership, duplicate class/student checks, related data, today’s agenda, attendance input, and bulk student import.

**Files/scope:** `classes_controller.ts`, `student_import_service.ts` integration seam; class/student repositories and class application service(s).

**Tasks:**

1. Move class list/show, student list, agenda, assessment lookup, ownership, duplicate detection, and CRUD to named methods.
2. Move import persistence/bulk update/create behavior to a repository method; keep file parsing and import summary formatting in the service.
3. Preserve class/student ownership checks, NIS uniqueness, role behavior, attendance payload handling, and partial-failure semantics unless existing tests prove a bug and the user separately approves a behavior change.
4. Ensure preloaded academic year/students are returned in the same shape.

**Verification:** Add tests for owner/non-owner access, duplicate class/NIS, import summary, attendance, agenda, and student deletion. Run typecheck/lint and targeted tests.

**Exit criteria:** Controller has only HTTP orchestration; repository owns all relation/ownership query composition and any multi-row writes.

### P7 — Extract annual and semester planning documents

**Context brief:** `annual_plans_controller.ts` and `semester_plans_controller.ts` repeat lookup lists, relation preloads, CRUD, ownership checks, and AI generation orchestration. Existing export/AI services must remain reusable.

**Files/scope:** The two planning controllers; planning repository/application services; existing AI and export services only at their call sites.

**Tasks:**

1. Create typed planning repository methods for list/show/owned lookup/create/update/delete and required class/subject/semester/sequence option data.
2. Move generation use-case orchestration, entitlement/usage calls, and persistence decisions into services while leaving prompt construction and document rendering in existing services.
3. Preserve route aliases, redirect targets, status fields, response messages, and generated content shape.

**Verification:** Add service tests with repository fakes and functional tests for CRUD/generation contracts; run typecheck/lint and targeted tests.

**Exit criteria:** Both controllers are thin, their repeated relation queries are centralized, and export functions receive compatible model/data shapes.

### P8 — Extract weekly and daily planning documents

**Context brief:** `weekly_lesson_plans_controller.ts` is the largest controller and contains AI normalization, content defaults, query/preload logic, generation, update/delete, and export preparation. `daily_lesson_plans_controller.ts` follows the same pattern. Weekly assessment loading currently queries `Student` and `PaudAssessment` directly.

**Files/scope:** `weekly_lesson_plans_controller.ts`, `daily_lesson_plans_controller.ts`, `weekly_assessment_loader.ts`; extend the planning repository and introduce/use a PAUD assessment read repository for the loader.

**Tasks:**

1. Move weekly/daily list/show/owned lookup, option loading, and persistence into repository methods.
2. Move AI generation orchestration and content normalization into application services; keep pure normalization/parser helpers out of repositories.
3. Make `loadWeeklyPlanAssessments` consume repository methods for students, assessments, preloads, and date fallback while retaining its output transformation.
4. Preserve week date fallback, relation names, AI-generated content, export data, route redirects, and error handling.

**Verification:** Extend existing weekly assessment tests; add tests for date-window fallback, owner scoping, generated plan persistence, and daily/weekly update/delete. Run typecheck/lint and targeted tests.

**Exit criteria:** The 744-line controller no longer builds queries or owns generation persistence; loader query composition is repository-owned and its formatted output is unchanged.

### P9 — Extract teaching modules, LKPD, media modules, express tools, and document workflows

**Context brief:** These flows combine repeated class/sequence lookups, content CRUD, AI generation, exports, and document autosave/status/duplicate behavior. `document_workflows_controller.ts` dynamically chooses models and clones records directly.

**Files/scope:** `teaching_modules_controller.ts`, `lkpds_controller.ts`, `media_modules_controller.ts`, `express_tools_controller.ts`, `document_workflows_controller.ts`; content/document repositories and application services.

**Tasks:**

1. Centralize content list/show/owned lookup/create/update/delete and option queries.
2. Replace dynamic controller model/query selection with a typed document repository strategy and service use cases for find, clone, autosave, and status transitions.
3. Keep AI prompts/queue calls, export services, file response headers, and pure content transformations in their appropriate services/edge adapters.
4. Preserve document type routing, clone field defaults, workflow versioning, audit events, and all existing Inertia/API payloads.

**Verification:** Add tests for each document type, ownership, clone/autosave/status versioning, content CRUD, and express-tool option scopes. Run typecheck/lint and targeted tests.

**Exit criteria:** No listed controller directly queries models; document workflow persistence is hidden behind typed repository methods; export output is unchanged.

### P10 — Extract standard assessments, scores, and attachments

**Context brief:** `assessments_controller.ts` creates an assessment and one score per student, preloads nested score/student data, updates scores, and deletes assessment data. `assessment_attachments_controller.ts` performs owned attachment retrieval for downloads.

**Files/scope:** `assessments_controller.ts`, `assessment_attachments_controller.ts`; assessment/score/attachment repositories and application services.

**Tasks:**

1. Move assessment list/show/owned lookup, class/subject/semester options, score preload, score update, and delete persistence into named methods.
2. Put assessment-plus-initial-scores multi-write behavior in a repository transaction only if it matches/preserves the existing contract; otherwise preserve current atomicity explicitly and test it.
3. Keep export services and file response handling at the service/controller edge while passing compatible data.
4. Preserve score ordering, ownership, semester selection, export formats, and all response messages.

**Verification:** Add tests for assessment ownership, score creation/update/delete, empty students, nested preload shape, and attachment ownership. Run typecheck/lint and targeted tests.

**Exit criteria:** Standard assessment controllers are lean and all relation-heavy or multi-row persistence is repository-owned.

### P11 — Extract PAUD assessments and report cards

**Context brief:** `paud_assessments_controller.ts` is a 638-line high-risk flow with attachment uploads, nested preloads, quick capture, AI generation, transaction-backed create/delete, filesystem cleanup, and ownership checks. `report_cards_controller.ts` combines standard averages/ranks, PAUD narrative compilation, narrative save/approval, and exports. `report_card_service.ts` currently contains aggregate SQL and multiple relation queries.

**Files/scope:** `paud_assessments_controller.ts`, `report_cards_controller.ts`, `report_card_service.ts`, `weekly_assessment_loader.ts` integration; PAUD/report repositories and application services.

**Tasks:**

1. Move PAUD list/timeline/bundle/owned lookup, attachment preloads, create/update/delete transactions, and attachment persistence to repository methods.
2. Keep upload validation, filesystem cleanup, AI integration, content parsing, and domain error interpretation in services; ensure cleanup behavior on transaction failure remains identical.
3. Move student/score/assessment/narrative data retrieval and aggregate SQL from `report_card_service.ts` to repository methods; keep averaging, ranking, narrative assembly, and label mapping in the service.
4. Move narrative save/update/approval persistence behind repository methods and preserve draft/approved transitions.
5. Preserve all PAUD instrument content fields, attachment order, date filters, report ranking semantics, and export payloads.

**Verification:** Add database-backed tests for transaction rollback, attachment ownership/order, timeline filters, report average/rank, narrative draft/approval, and empty states. Re-run existing TOON/weekly tests. Run typecheck/lint and targeted tests.

**Exit criteria:** No PAUD/report controller or report service builds complex queries/transactions; file cleanup and report calculations remain behaviorally equivalent.

### P12 — Extract exams and exam-generation persistence

**Context brief:** `exams_controller.ts` handles CRUD, owned lookups, image upload, generation queueing, generation status, and exports. `exam_generation_service.ts` performs long-running AI generation and repeatedly persists progress/questions; `generate_exam.ts` invokes it.

**Files/scope:** `exams_controller.ts`, `exam_generation_service.ts`, `generate_exam.ts`; exam repository/application service and generation-progress persistence methods.

**Tasks:**

1. Move exam list/show/owned lookup/create/update/delete and class option queries to repository methods/services.
2. Create explicit repository methods for generation status/progress/question persistence; keep prompt creation, normalization, image-request construction, and AI calls in the service.
3. Preserve queued/background behavior, partial image failure status, progress JSON, entitlement errors, upload semantics, export inputs, and API status codes.
4. Do not mix worksheet layout/rendering code into the repository.

**Verification:** Add tests for owned exam CRUD, generation status transitions, partial visual failures, retry/error persistence, and export compatibility. Run existing worksheet tests plus typecheck/lint.

**Exit criteria:** The controller is HTTP-only and long-running generation persistence uses named repository methods without changing asynchronous behavior.

### P13 — Extract AI settings/background persistence, health probe, and enforce the boundary

**Context brief:** Remaining persistence access is in `admin_ai_settings_controller.ts`, `ai_service.ts`, `ai_queue_service.ts`, `visual_asset_service.ts`, AI jobs, `generate_narratives.ts`, `write_audit_log.ts`, and the `/health` route’s raw database probe. Some trivial lookups may remain allowed, but complex/repeated persistence must be explicit and documented.

**Files/scope:** AI settings controller/service, AI queue/jobs, visual asset/audit/narrative persistence seams, `start/routes.ts` health handler, repository scan/tests, and final documentation.

**Tasks:**

1. Move AI setting reads/writes, AI job lifecycle updates, generated visual asset cache/persistence, narrative upsert, and any repeated job writes behind concrete repositories where they exceed the simple-query exception.
2. Move the health raw query into a small infrastructure repository/service so `start/routes.ts` remains an HTTP adapter.
3. Keep external Codex/provider calls, OAuth protocol, prompt construction, image/SVG sanitization, audit payload construction, and file generation out of repositories.
4. Run static scans over controllers, services, and jobs for direct complex query patterns, transaction callbacks, raw SQL, and model imports. Review every remaining match against the documented simple exception.
5. Update `AGENTS.md` only if the final implementation reveals a missing rule; do not remove or rewrite existing project/UI rules.

**Verification:** Run `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, `git diff --check`, and targeted tests. Re-run `npm test` outside the failing network-interface environment if necessary and record both results. Review `git diff --stat` and `git status --short` for scope.

**Exit criteria:** All controller database access is gone; all complex service/job database access is repository-owned; remaining simple queries are intentional and documented; all checks pass or have an explicitly recorded environmental blocker; no merge/push occurs.

## Review-gate result

An adversarial subagent was delegated to review this draft, but it remained in `running` state after multiple waits and was shut down without returning findings. A local gate then checked the affected controller/service inventory, plan headings, dependency graph, `git diff --check`, and explicit intentional exclusions. The local gate found that `mcp_controller.ts` was not named in the file inventory even though it is intentionally out of scope; that omission is corrected above. No implementation has started.

## Adversarial review checklist

Before approving this blueprint, review it against these failure modes:

- A “repository” that merely mirrors every model method and leaves business/query composition in services.
- A service that still builds a long Lucid chain, returns a query builder, or owns a transaction callback.
- A controller that still imports models indirectly through helper methods or retains loops over database writes.
- Ownership predicates accidentally removed while moving queries, causing IDOR/cross-school data exposure.
- Preload names, ordering, pagination metadata, date/time boundaries, enum values, or JSON keys changing during extraction.
- Credit/quota/webhook transactions losing row locks or idempotency.
- PAUD attachment/file cleanup diverging on transaction failure.
- Report rank/average/narrative semantics changing because calculation code was incorrectly moved into the repository.
- AI/background jobs changing retry, progress, partial-failure, or queue behavior.
- The refactor touching UI text, generated route contracts, migrations, or unrelated files from the unmerged parent feature branch.
- The plan being too broad for review; split any step that cannot be completed and tested as one independent checkpoint.

## Checkpoint and rollback protocol

Each P-step is an independent checkpoint on `refactor/controller-service-repository`:

1. Add/adjust tests first and run the narrowest relevant command.
2. Implement only that step’s files.
3. Run typecheck/lint and the targeted tests.
4. Review the diff and perform the controller/service/repository static scan.
5. Commit one conventional checkpoint; never merge or push as part of this plan.
6. If a step regresses behavior, revert only that checkpoint or restore the pre-step files, then amend the plan before continuing. Do not reset the whole branch because it contains unrelated user work.

## Plan mutation protocol

This file is the current draft. After user/adversarial review, update the status, dependency graph, affected file lists, and a dated “Change log” section rather than silently changing step scope. Any newly discovered cross-domain dependency must be inserted as an explicit edge. Implementation starts only after the user approves the revised blueprint.
