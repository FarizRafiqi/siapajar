import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('go-to-market readiness contracts', () => {
  test('checkout only resolves active, explicitly selected packages', async ({ assert }) => {
    const source = await readProjectFile('app/repositories/package_repository.ts')

    assert.include(source, ".where('is_active', true)")
    assert.include(source, 'Never fall back')
    assert.notInclude(source, "where('is_highlighted'")
  })

  test('verified paid top-ups activate the purchased package atomically', async ({ assert }) => {
    const invoiceRepository = await readProjectFile(
      'app/repositories/payment_invoice_repository.ts'
    )
    const invoiceModel = await readProjectFile('app/models/payment_invoice.ts')
    const freeBenefitRepository = await readProjectFile(
      'app/repositories/free_benefit_repository.ts'
    )

    assert.include(invoiceModel, "columnName: 'package_id'")
    assert.include(invoiceRepository, 'purchasedPackage')
    assert.include(invoiceRepository, "source: 'mayar_topup'")
    assert.include(invoiceRepository, "where('status', 'active')")
    assert.include(freeBenefitRepository, 'without downgrading that paid package')
  })

  test('Mayar reads explicit catalog credit features and rejects unknown packages', async ({
    assert,
  }) => {
    const source = await readProjectFile('app/services/mayar_service.ts')

    assert.include(source, 'explicit integer')
    assert.include(source, 'getCreditsAmount(pkg.features)')
    assert.include(source, "throw new Error('Paket tidak memiliki jumlah kredit yang valid.')")
    assert.notInclude(source, 'legacyCredits')
  })

  test('mobile API tokens are signed and PAUD reads are owner-scoped', async ({ assert }) => {
    const tokenService = await readProjectFile('app/services/api_token_service.ts')
    const paudRepository = await readProjectFile('app/repositories/paud_assessment_repository.ts')
    const paudService = await readProjectFile('app/services/paud_assessment_service.ts')

    assert.include(tokenService, "createHmac('sha256'")
    assert.include(tokenService, 'timingSafeEqual')
    assert.include(paudRepository, ".where('user_id', userId)")
    assert.include(paudRepository, 'findOwnedStudentsInClass')
    assert.include(paudService, 'creditService.withGenerationCredit')
    assert.notInclude(paudService, 'Buffer.from(token')
  })

  test('dashboard and worker follow the account-specific tool/queue contract', async ({
    assert,
  }) => {
    const dashboard = await readProjectFile('inertia/pages/dashboard/index.tsx')
    const education = await readProjectFile('inertia/lib/education.ts')
    const layout = await readProjectFile('inertia/layouts/dashboard.tsx')
    const entrypoint = await readProjectFile('docker-entrypoint.sh')

    assert.include(dashboard, "href: '/paud-assessments'")
    assert.include(dashboard, 'isPaudProfile(educationLevel, institutionType)')
    assert.include(education, "institution === 'ra'")
    assert.include(layout, 'autoStart={false}')
    assert.include(entrypoint, 'exam-generation')
  })

  test('AI generation has result-cache and provider prompt-cache safeguards', async ({
    assert,
  }) => {
    const queue = await readProjectFile('app/services/ai_queue_service.ts')
    const jobs = await Promise.all([
      readProjectFile('app/jobs/generate_ai_json.ts'),
      readProjectFile('app/jobs/generate_ai_image.ts'),
      readProjectFile('app/jobs/generate_ai_svg.ts'),
    ])
    const aiService = await readProjectFile('app/services/ai_service.ts')
    const repository = await readProjectFile('app/repositories/ai_job_repository.ts')

    assert.include(queue, 'AI_RESULT_CACHE_VERSION')
    assert.include(queue, 'provider: setting.provider')
    assert.include(queue, 'routingCombo hanya boleh digunakan saat provider AI adalah 9router')
    assert.include(queue, "action: 'ai.result_cache.hit'")
    assert.include(queue, 'if (reserved)')
    assert.include(repository, 'claimProcessing')
    assert.include(repository, '.forUpdate()')
    for (const job of jobs) {
      assert.include(job, 'reserveUsage')
      assert.include(job, 'claimProcessing')
    }
    assert.include(aiService, 'prompt_cache_key')
    assert.include(aiService, 'systemInstruction')
    assert.include(aiService, 'cache_control')
    assert.include(aiService, 'cachedTokens')
  })

  test('AI job terminology separates business operations from 9router bundles', async ({
    assert,
  }) => {
    const model = await readProjectFile('app/models/ai_job.ts')
    const migration = await readProjectFile(
      'database/migrations/1783900000049_rename_ai_job_combo_to_operation.ts'
    )
    const services = await Promise.all([
      readProjectFile('app/services/teaching_module_service.ts'),
      readProjectFile('app/services/exam_generation_service.ts'),
      readProjectFile('app/services/ai_service.ts'),
    ])
    const aiController = await readProjectFile('app/controllers/admin_ai_settings_controller.ts')

    assert.include(model, 'declare operation: string')
    assert.include(migration, "renameColumn('combo', 'operation')")
    assert.include(services[0], "operation: 'teaching_module.generate'")
    assert.include(services[1], "operation: 'exam.generate_questions'")
    assert.include(services[2], 'routingCombo')
    assert.include(services[2], 'routingCombo?: string')
    assert.notInclude(aiController, 'routingCombo: model || undefined')
    assert.notInclude(services[0], 'siapajar-docgen')
    assert.notInclude(services[1], 'siapajar-soal')
  })

  test('entitlements fail closed and rich text has no native browser dialog', async ({
    assert,
  }) => {
    const entitlementService = await readProjectFile('app/services/entitlement_service.ts')
    const editor = await readProjectFile('inertia/components/ui/rich-text-editor.tsx')
    const credits = await readProjectFile('app/repositories/credit_repository.ts')
    const katrol = await readProjectFile('inertia/pages/dashboard/tools/katrol.tsx')
    const prompts = await readProjectFile('app/services/ai_prompts.ts')

    assert.include(entitlementService, 'Fail closed')
    assert.include(entitlementService, 'Paket aktif belum ditetapkan')
    assert.include(entitlementService, 'Fitur ${getFeatureLabel(featureKey)} belum tersedia')
    assert.notMatch(editor, /window\.(confirm|alert|prompt)\s*\(/)
    assert.include(editor, 'role="dialog"')
    assert.include(credits, 'A retry after an explicit refund is a new attempt')
    assert.include(credits, 'const usages = await CreditTransaction.query')
    assert.notInclude(katrol, 'Ahmad Fauzi: 45')
    assert.notInclude(katrol, 'Kelas 1A')
    assert.notInclude(
      await readProjectFile('inertia/pages/dashboard/tools/jurnal.tsx'),
      '28 Hadir, 1 Izin, 1 Sakit'
    )
    assert.notInclude(prompts, 'Siswa A, Siswa B, Siswa C')
  })

  test('document exports commit quota only after a successful render', async ({ assert }) => {
    const [docx, pdf] = await Promise.all([
      readProjectFile('app/services/export_service.ts'),
      readProjectFile('app/services/pdf_export_service.ts'),
    ])

    for (const source of [docx, pdf]) {
      assert.include(source, 'const result = await work()')
      assert.include(source, 'releaseUsageReservation')
      assert.include(source, 'throw error')
    }
    assert.include(docx, 'async function withDocxExportQuota')
    assert.include(pdf, 'async function withPdfExportQuota')
    assert.notInclude(docx, 'await consumeExport(user)')
    assert.notInclude(pdf, 'await consumePdfExport(user)')
  })

  test('Express tools keep one contract while adapting to each education profile', async ({
    assert,
  }) => {
    const [profile, prompts, express, routes, soal, prota, home] = await Promise.all([
      readProjectFile('app/services/education_profile.ts'),
      readProjectFile('app/services/ai_prompts.ts'),
      readProjectFile('app/services/express_tools_service.ts'),
      readProjectFile('start/routes.ts'),
      readProjectFile('inertia/pages/dashboard/tools/soal.tsx'),
      readProjectFile('inertia/pages/dashboard/tools/prota-promes.tsx'),
      readProjectFile('inertia/pages/home.tsx'),
    ])

    assert.include(profile, 'future levels meaningful')
    assert.include(profile, 'resolveEducationProfile')
    assert.include(prompts, 'profile.audience')
    assert.include(prompts, 'educationLevel?: string | null')
    assert.include(express, 'normalizeJournalResult')
    assert.include(express, 'normalizeKokurikulerResult')
    assert.include(express, 'rawScore: originalScore')
    assert.include(routes, "post('/soal/generate'")
    assert.include(routes, "post('/prota-promes/generate'")
    assert.include(routes, "post('/rapor/generate'")
    assert.include(soal, "'/soal/generate'")
    assert.notInclude(soal, "'/assessments/generate'")
    assert.include(prota, 'academicYearId')
    assert.include(prota, 'semesterId')
    assert.include(prota, 'Biaya: 2 Kredit')
    assert.include(home, "label: 'QRIS'")
    assert.include(home, "label: 'E-wallet'")
    assert.include(home, "label: 'Pembayaran terverifikasi'")
    assert.include(home, 'const featuredTools = expressTools.slice(0, 6)')
    assert.include(home, 'Lihat Semua Alat')
  })
})
