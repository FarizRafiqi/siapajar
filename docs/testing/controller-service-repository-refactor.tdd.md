# Controller–Service–Repository Refactor — TDD Evidence

Tanggal eksekusi: 2026-08-30  
Branch: `refactor/controller-service-repository`  
Source plan: [`plans/controller-service-repository-refactor.md`](../../plans/controller-service-repository-refactor.md)

## User journeys dan acceptance criteria

- Sebagai HTTP client, controller hanya membaca request, memvalidasi input, memanggil service, dan mengembalikan response yang sama.
- Sebagai application service, service mengorkestrasi business rule, integrasi, dan DTO; operasi model yang benar-benar sederhana tetap boleh langsung dipanggil.
- Sebagai persistence boundary, repository menyimpan query kompleks, relation/preload, ownership scope, aggregate, pagination, raw SQL, transaction, dan bulk/multi-row write.
- Sebagai user login, pengguna dapat menampilkan atau menyembunyikan password yang sedang diketik tanpa mengubah nilai input atau contract login.
- Semua route, response shape, teks, validator, dan behavior untuk user yang berwenang tetap kompatibel.

## Batch evidence

Plan memiliki 14 batch: P0–P13. Setiap batch dibuat dengan test boundary lebih dahulu, lalu perubahan production code dan checkpoint refactor.

| Batch    | Area                                | Test boundary                            | Checkpoint RED → GREEN/refactor                                                      |
| -------- | ----------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| 1 (P0)   | Foundation dan aturan layering      | `backend_layering_contract.spec.ts`      | `f83b71b` → `5eac182`                                                                |
| 2 (P1)   | Auth, account, onboarding, settings | `p1_auth_account_layering.spec.ts`       | `cffd3d7`, `f1a5ec8` → `e1f527a`                                                     |
| 3 (P2)   | Admin catalog dan subjects          | `p2_admin_catalog_layering.spec.ts`      | `4fcf096` → `2490a8a`                                                                |
| 4 (P3)   | Dashboard read models               | `p3_dashboard_layering.spec.ts`          | `5bbd81a` → `50acb3c`                                                                |
| 5 (P4)   | Billing, credits, entitlements      | `p4_billing_layering.spec.ts`            | `24e4ef0` → `513dcbf`; preload cleanup `30ad70a`                                     |
| 6 (P5)   | Curriculum dan context              | `p5_curriculum_layering.spec.ts`         | `49812a7` → `07286c2`; audit fix `bd747a2` → `60ab18e`                               |
| 7 (P6)   | Classes dan students                | `p6_classes_layering.spec.ts`            | `027c1ac` → `3b71c15`; read-model cleanup `795175a`; audit fix `bd747a2` → `60ab18e` |
| 8 (P7)   | Annual dan semester plans           | `p7_plans_layering.spec.ts`              | `9784a48` → `caaad86`                                                                |
| 9 (P8)   | Weekly dan daily lesson plans       | `p8_lesson_plan_layering.spec.ts`        | `ec872df` → `10e598b`                                                                |
| 10 (P9)  | Content dan document workflows      | `p9_content_workflow_layering.spec.ts`   | `4906ad8` → `e5a2311`                                                                |
| 11 (P10) | Standard assessments                | `p10_assessment_layering.spec.ts`        | `a349e8c` → `dbf0120`                                                                |
| 12 (P11) | PAUD assessments dan report cards   | `p11_paud_report_layering.spec.ts`       | `19481a7` → `213e246`                                                                |
| 13 (P12) | Exams dan generation persistence    | `p12_exam_layering.spec.ts`              | `b10d451` → `d018765`                                                                |
| 14 (P13) | AI, jobs, infrastructure, health    | `p13_ai_infrastructure_layering.spec.ts` | `a347146` → `43142a3`                                                                |

Cross-cutting follow-ups yang juga melewati test/validasi:

- `ea3c7ed`: menghapus repository wrapper untuk operasi persistence sederhana.
- `2930c67`: menambahkan login password visibility toggle; dijamin oleh `login_password_visibility.spec.ts`.
- `30ad70a`: memindahkan package/entitlement preload billing ke repository.
- `795175a`: memindahkan mobile class/student read model ke repository dengan ownership scope.
- `bd747a2`: test RED untuk cascading delete curriculum dan bulk student import.
- `60ab18e`: memindahkan cascading delete dan bulk import ke repository.

## Explicit RED/GREEN evidence untuk audit terakhir

RED dijalankan dengan:

```text
node ace test --files tests/unit/p5_curriculum_layering.spec.ts --files tests/unit/p6_classes_layering.spec.ts
```

Hasil: `Tests 6 passed, 4 failed (10)`. Failure berasal dari method `deleteObjectiveWithIndicators`, `importStudents`, dan delegasi service yang memang belum diimplementasikan.

GREEN dengan command yang sama menghasilkan: `Tests 10 passed (10)`.

## Final verification

- `npm test` — `97 passed (97)`.
- `npm run typecheck` — pass.
- `npm run lint` — 0 error; 6 warning hanya dari generated files di `.worktrees/`.
- `npm run build` — production build dan `mcp:build` selesai.
- `git diff --check` — pass.
- Static scan controller — tidak menemukan import model/database, query builder, raw query, atau transaction.
- Static scan service/job — remaining query builder matches hanya operasi sederhana yang didokumentasikan di `AGENTS.md`; query relation-heavy, aggregate, transaction, raw SQL, dan bulk/multi-row persistence berada di repository.

## Coverage dan known gaps

Repository tidak memiliki script coverage. `c8` dan `nyc` juga tidak tersedia secara lokal, sehingga tidak ada angka coverage 80% yang dapat diklaim secara jujur. Suite yang tersedia saat ini berupa Japa unit/contract tests; tidak ada suite `tests/e2e` atau database-backed integration suite untuk seluruh CRUD flow.

Security review juga mencatat follow-up yang tidak diubah dalam refactor ini:

- `npm audit --omit=dev` melaporkan 8 vulnerability production dependency (6 high, 2 moderate), termasuk `xlsx` tanpa fix yang tersedia.
- Token API login lama masih berupa payload base64 tanpa signature/expiry yang tervalidasi.
- Verifikasi webhook Mayar fail-open ketika secret tidak dikonfigurasi.

Perubahan ownership pada mobile class read model adalah koreksi boundary keamanan: output untuk owner yang sah tetap sama, sedangkan akses ke class milik user lain tidak lagi mengembalikan daftar siswa.

## Delivery evidence

Branch aktif tetap `refactor/controller-service-repository`, tidak di-merge dan tidak di-push. `plans/` dan `.worktrees/` tetap tidak distage sesuai instruksi kerja.
