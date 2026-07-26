# Graph Report - .  (2026-07-26)

## Corpus Check
- 145 files · ~89,393 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 787 nodes · 802 edges · 159 communities (71 shown, 88 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.8)
- Token cost: 0 input · 164,601 output

## Community Hubs (Navigation)
- Tooling & Lint Config
- Roles & Permissions Model
- Package Boundaries & Import Config
- UI Text/Number Animation Components
- UI Background & Card Effects Components
- Tuyau Route Registry
- Vine Schema Definitions
- Exams Dashboard Page
- Inertia TS Config
- Header & Sidebar Navigation
- User Model & Auth
- Hero Illustration Marketing Concepts
- Inertia Middleware & Shared Props
- Package Model & Seeding
- Backend Runtime Dependencies
- Classes Controller
- Exams Controller
- Inertia TS Project Config
- Annual Plans Controller
- Semester Plans Controller
- Subjects Controller
- Teaching Modules Controller
- Dashboard Layout & Settings Page
- Dashboard Stats Page
- Semester Plan Detail Page
- Problem Illustration Marketing Concepts
- Annual Plan Detail Page
- Semester Plans Index Page
- Teaching Module Detail Page
- API Serializer
- TS Config Base
- SchoolClass Model
- Semester Model
- Auth Config
- Theme Toggle & Auth Pages
- Annual Plans Index Page
- Classes Index Page
- Class Detail Page
- Teaching Modules Index Page
- Inertia Shared Data Types
- Route Types
- Session Controller
- Academic Year Model
- Annual Plan Model
- Exam Model
- Semester Plan Model
- Student Model
- Subject Model
- Teaching Module Model
- Generate Validators
- Accordion UI Component
- Inertia Pages Types
- New Account Controller
- Onboarding Controller
- Settings Controller
- HTTP Exception Handler
- Settings Validators
- User Validators
- Encryption Config
- Hash Config
- Logger Config
- Remember Me Tokens Migration
- Onboarding Migration
- Test Bootstrap
- Dashboard Controller
- Auth Middleware
- Container Bindings Middleware
- Guest Middleware
- Onboarding Middleware
- Role Middleware
- Silent Auth Middleware
- Annual Plan Validators
- Class Validators
- Exam Validators
- Semester Plan Validators
- Subject Validators
- Teaching Module Validators
- Console Entrypoint
- Server Entrypoint
- Test Entrypoint
- Subject Seeder
- Vine Validator Types
- AdonisJS Core Dep
- AdonisJS CORS Dep
- AdonisJS Lucid Dep
- Controllers Registry
- Events Registry
- Listeners Registry
- AdonisJS Session Dep
- AdonisJS Shield Dep
- AdonisJS Static Dep
- AdonisJS Vite Dep
- Onboarding Validator
- Student Validator
- clsx Dep
- HTTP Kernel Entrypoint
- Bodyparser Config
- CORS Config
- Database Config
- Inertia Config
- Session Config
- Shield Config
- Static Server Config
- Vite Backend Config
- Docker Entrypoint Script
- Edge Templating Dep
- Framer Motion Dep
- HeroUI React Dep
- HeroUI Styles Dep
- Vue Shims
- Inertia React Dep
- Lucide React Dep
- pg Dep
- React Dep
- React DOM Dep
- Reflect Metadata Dep
- Sonner Toast Dep
- Tailwind Merge Dep
- Tailwindcss Dep
- Tailwindcss Vite Plugin Dep
- Tuyau Core Dep
- pg Types Dep
- Vine JS Dep
- Dapodik Integration & DB Schema Concepts
- Project Structure & Quick Start Docs
- HTTP Kernel Middleware Registry
- Analisis CP Feature Concept
- Bank Soal Pribadi Feature Concept
- Jurnal Refleksi Harian Feature Concept
- Kurikulum Merdeka Concept
- LKPD Feature Concept
- Media Ajar Feature Concept
- Pemetaan Materi Feature Concept
- Peringkat Kelas Feature Concept
- Predikat TK Concept
- SiapAjar Platform Concept

## God Nodes (most connected - your core abstractions)
1. `cn()` - 31 edges
2. `imports` - 19 edges
3. `DashboardWrapper()` - 14 edges
4. `9router (AI Model Router)` - 11 edges
5. `User` - 10 edges
6. `Hero Illustration Image` - 10 edges
7. `AdonisJS 7 (Backend)` - 9 edges
8. `ClassesController` - 8 edges
9. `scripts` - 8 edges
10. `AnnualPlansController` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Guru (Teacher) Role` --conceptually_related_to--> `Soal PTS/PAS/PAT Generator`  [INFERRED]
  docs/roles-and-permissions.md → PRD-SiapAjar.md
- `9router (README)` --shares_data_with--> `9router (AI Model Router)`  [INFERRED]
  README.md → PRD-SiapAjar.md
- `Guru (Teacher) Role` --conceptually_related_to--> `Prota (Program Tahunan)`  [INFERRED]
  docs/roles-and-permissions.md → PRD-SiapAjar.md
- `Guru (Teacher) Role` --conceptually_related_to--> `Modul Ajar / RPP Deep Learning`  [INFERRED]
  docs/roles-and-permissions.md → PRD-SiapAjar.md
- `Kepala Sekolah (Principal) Role` --conceptually_related_to--> `Integrasi RPT Digital (API)`  [INFERRED]
  docs/roles-and-permissions.md → PRD-SiapAjar.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **9router siapajar-docgen Combo Powers Planning Documents** — prd_siapajar_9router, prd_siapajar_prota, prd_siapajar_promes, prd_siapajar_atp, prd_siapajar_modul_ajar [EXTRACTED 1.00]
- **Four-Role Permission Matrix** — docs_roles_and_permissions_admin_role, docs_roles_and_permissions_guru_role, docs_roles_and_permissions_kepala_sekolah_role, docs_roles_and_permissions_orang_tua_role [EXTRACTED 1.00]
- **AdonisJS Monolith Architecture Stack** — prd_siapajar_adonisjs, prd_siapajar_inertiajs, prd_siapajar_vue3, prd_siapajar_postgresql, prd_siapajar_redis [EXTRACTED 1.00]

## Communities (159 total, 88 thin omitted)

### Community 0 - "Tooling & Lint Config"
Cohesion: 0.05
Nodes (43): @adonisjs/assembler, @adonisjs/eslint-config, @adonisjs/prettier-config, @adonisjs/tsconfig, eslint, hot-hook, @japa/assert, @japa/browser-client (+35 more)

### Community 1 - "Roles & Permissions Model"
Cohesion: 0.07
Nodes (43): Administrator Role, Guru (Teacher) Role, Kepala Sekolah (Principal) Role, Orang Tua (Parent) Role, Own Data Filter Pattern, Package Features Matrix, packages Table, role_middleware (+35 more)

### Community 2 - "Package Boundaries & Import Config"
Cohesion: 0.05
Nodes (39): engines, node, hotHook, boundaries, imports, #abilities/*, #config/*, #controllers/* (+31 more)

### Community 3 - "UI Text/Number Animation Components"
Cohesion: 0.09
Nodes (14): AnimatedNumber(), AnimatedNumberProps, TextGenerateEffect(), TextGenerateEffectProps, TracingBeam(), TracingBeamProps, Settings(), faqs (+6 more)

### Community 4 - "UI Background & Card Effects Components"
Cohesion: 0.16
Nodes (13): AuroraBackground(), AuroraBackgroundProps, InfiniteMovingCards(), InfiniteMovingCardsProps, MagicButton(), MagicButtonProps, SpotlightCard(), SpotlightCardProps (+5 more)

### Community 5 - "Tuyau Route Registry"
Cohesion: 0.15
Nodes (8): placeholder, registry, @tuyau/core/types, UserRegistry, ParamValue, ApiDefinition, client, DefaultLayoutProps

### Community 6 - "Vine Schema Definitions"
Cohesion: 0.34
Nodes (14): AcademicYearSchema, AnnualPlanSchema, ClassSchema, ExamSchema, PackageSchema, RememberMeTokenSchema, SemesterPlanSchema, SemesterSchema (+6 more)

### Community 7 - "Exams Dashboard Page"
Cohesion: 0.19
Nodes (13): Exam, EXAM_TYPES, ExamsIndex(), ExamsIndexProps, ExamType, examTypeLabel(), SchoolClass, Subject (+5 more)

### Community 8 - "Inertia TS Config"
Cohesion: 0.14
Nodes (13): compilerOptions, jsx, module, paths, extends, include, @generated/*, ../.adonisjs/client/* (+5 more)

### Community 9 - "Header & Sidebar Navigation"
Cohesion: 0.15
Nodes (9): HeaderProps, adminNavigation, guruNavigation, Sidebar(), SidebarProps, User, DashboardLayout(), DashboardLayoutProps (+1 more)

### Community 10 - "User Model & Auth"
Cohesion: 0.17
Nodes (5): AuthFinder, belongsTo, column, dateTime, User

### Community 11 - "Hero Illustration Marketing Concepts"
Cohesion: 0.26
Nodes (12): Siapajar Education/Class Management Platform, Analytics Charts (bar chart, pie/donut chart), Books Icon (academic/learning materials), Calendar Icon (scheduling/planning), Checklist / Task Completion Widgets (green checkmarks), Hero Illustration Image, Lightbulb Icon (insight/ideas), Laptop (MacBook) (+4 more)

### Community 12 - "Inertia Middleware & Shared Props"
Cohesion: 0.22
Nodes (5): @adonisjs/inertia/types, InertiaMiddleware, MiddlewareSharedProps, SharedProps, UserTransformer

### Community 13 - "Package Model & Seeding"
Cohesion: 0.20
Nodes (6): Package, column, dateTime, hasMany, beforeCreate, DatabaseSeeder

### Community 14 - "Backend Runtime Dependencies"
Cohesion: 0.22
Nodes (9): @adonisjs/auth, @adonisjs/inertia, better-sqlite3, luxon, dependencies, @adonisjs/auth, @adonisjs/inertia, better-sqlite3 (+1 more)

### Community 17 - "Inertia TS Project Config"
Cohesion: 0.22
Nodes (8): ./inertia/**/*.ts, ./inertia/tsconfig.json, ./inertia/**/*.tsx, compilerOptions, composite, rootDir, extends, include

### Community 22 - "Dashboard Layout & Settings Page"
Cohesion: 0.29
Nodes (6): DashboardWrapper(), DashboardWrapperProps, PageProps, User, SettingsProps, UserProps

### Community 23 - "Dashboard Stats Page"
Cohesion: 0.25
Nodes (7): AdminStats, colorMap, Dashboard(), DashboardProps, RecentItem, statCards, Stats

### Community 24 - "Semester Plan Detail Page"
Cohesion: 0.25
Nodes (6): SchoolClass, SECTIONS, Semester, SemesterPlan, SemesterPlanContent, SemesterPlanShowProps

### Community 25 - "Problem Illustration Marketing Concepts"
Cohesion: 0.29
Nodes (8): Administrative Overload (concept), Deadline Clock Icons (multiple), Cluttered Desk with Laptop, Books, Notebook, Folders, Floating Paper Documents, Landing Page Problem/Pain-Point Section, Indonesian Education / School Admin Domain (Siapajar), Stressed Teacher (Hijab, Batik Jacket), Urgent File Folders (exclamation mark icons)

### Community 26 - "Annual Plan Detail Page"
Cohesion: 0.29
Nodes (5): AcademicYear, AnnualPlan, AnnualPlanContent, AnnualPlanShowProps, SECTIONS

### Community 27 - "Semester Plans Index Page"
Cohesion: 0.29
Nodes (5): SchoolClass, Semester, SemesterPlan, SemesterPlansIndexProps, Subject

### Community 28 - "Teaching Module Detail Page"
Cohesion: 0.29
Nodes (6): SchoolClass, SECTIONS, TeachingModule, TeachingModuleContent, TeachingModuleShow(), TeachingModuleShowProps

### Community 29 - "API Serializer"
Cohesion: 0.29
Nodes (5): @adonisjs/core/http, ApiSerializer, HttpContext, serialize, serializer

### Community 30 - "TS Config Base"
Cohesion: 0.29
Nodes (6): @adonisjs/tsconfig/tsconfig.app.json, compilerOptions, outDir, rootDir, extends, references

### Community 31 - "SchoolClass Model"
Cohesion: 0.33
Nodes (5): SchoolClass, belongsTo, column, dateTime, hasMany

### Community 32 - "Semester Model"
Cohesion: 0.33
Nodes (5): Semester, belongsTo, column, dateTime, hasMany

### Community 33 - "Auth Config"
Cohesion: 0.33
Nodes (5): @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList

### Community 35 - "Annual Plans Index Page"
Cohesion: 0.33
Nodes (4): AcademicYear, AnnualPlan, AnnualPlansIndexProps, Subject

### Community 36 - "Classes Index Page"
Cohesion: 0.33
Nodes (4): AcademicYear, ClassesIndexProps, SchoolClass, Student

### Community 37 - "Class Detail Page"
Cohesion: 0.33
Nodes (4): AcademicYear, ClassShowProps, SchoolClass, Student

### Community 38 - "Teaching Modules Index Page"
Cohesion: 0.33
Nodes (5): SchoolClass, Subject, TeachingModule, TeachingModulesIndex(), TeachingModulesIndexProps

### Community 39 - "Inertia Shared Data Types"
Cohesion: 0.40
Nodes (4): Data, SharedProps, User, Variants

### Community 40 - "Route Types"
Cohesion: 0.50
Nodes (4): @adonisjs/core/types/http, ParamValue, RoutesList, ScannedRoutes

### Community 42 - "Academic Year Model"
Cohesion: 0.40
Nodes (4): AcademicYear, column, dateTime, hasMany

### Community 43 - "Annual Plan Model"
Cohesion: 0.40
Nodes (4): AnnualPlan, belongsTo, column, dateTime

### Community 44 - "Exam Model"
Cohesion: 0.40
Nodes (4): Exam, belongsTo, column, dateTime

### Community 45 - "Semester Plan Model"
Cohesion: 0.40
Nodes (4): SemesterPlan, belongsTo, column, dateTime

### Community 46 - "Student Model"
Cohesion: 0.40
Nodes (4): Student, belongsTo, column, dateTime

### Community 47 - "Subject Model"
Cohesion: 0.40
Nodes (4): Subject, belongsTo, column, dateTime

### Community 48 - "Teaching Module Model"
Cohesion: 0.40
Nodes (4): TeachingModule, belongsTo, column, dateTime

### Community 49 - "Generate Validators"
Cohesion: 0.40
Nodes (4): generateAnnualPlanValidator, generateExamValidator, generateSemesterPlanValidator, generateTeachingModuleValidator

### Community 50 - "Accordion UI Component"
Cohesion: 0.40
Nodes (3): Accordion(), AccordionItemProps, AccordionProps

### Community 51 - "Inertia Pages Types"
Cohesion: 0.50
Nodes (3): @adonisjs/inertia/types, ExtractProps, InertiaPages

### Community 56 - "Settings Validators"
Cohesion: 0.83
Nodes (3): createAdminSettingsValidator(), createSettingsValidator(), uniqueEmail()

### Community 58 - "Encryption Config"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, encryptionConfig, EncryptorsList

### Community 59 - "Hash Config"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, hashConfig, HashersList

### Community 60 - "Logger Config"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, loggerConfig, LoggersList

## Ambiguous Edges - Review These
- `Orang Tua (Parent) Role` → `Own Data Filter Pattern`  [AMBIGUOUS]
  docs/roles-and-permissions.md · relation: references

## Knowledge Gaps
- **286 isolated node(s):** `Data`, `User`, `Variants`, `SharedProps`, `placeholder` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **88 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Orang Tua (Parent) Role` and `Own Data Filter Pattern`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `dependencies` connect `Backend Runtime Dependencies` to `React Dep`, `React DOM Dep`, `Package Boundaries & Import Config`, `Reflect Metadata Dep`, `Sonner Toast Dep`, `Tailwind Merge Dep`, `Tailwindcss Dep`, `Tailwindcss Vite Plugin Dep`, `Tuyau Core Dep`, `pg Types Dep`, `Vine JS Dep`, `AdonisJS Core Dep`, `AdonisJS CORS Dep`, `AdonisJS Lucid Dep`, `AdonisJS Session Dep`, `AdonisJS Shield Dep`, `AdonisJS Static Dep`, `AdonisJS Vite Dep`, `clsx Dep`, `Edge Templating Dep`, `Framer Motion Dep`, `HeroUI React Dep`, `HeroUI Styles Dep`, `Inertia React Dep`, `Lucide React Dep`, `pg Dep`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Tooling & Lint Config` to `Package Boundaries & Import Config`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Background & Card Effects Components` to `UI Text/Number Animation Components`, `Teaching Modules Index Page`, `Exams Dashboard Page`, `Header & Sidebar Navigation`, `Accordion UI Component`, `Dashboard Layout & Settings Page`, `Dashboard Stats Page`, `Teaching Module Detail Page`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `Data`, `User`, `Variants` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tooling & Lint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Roles & Permissions Model` be split into smaller, more focused modules?**
  _Cohesion score 0.06533776301218161 - nodes in this community are weakly interconnected._