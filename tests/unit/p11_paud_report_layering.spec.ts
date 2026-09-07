import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P11 PAUD assessment and report card layering', () => {
  test('keeps PAUD and report card controllers free of persistence code', async ({ assert }) => {
    for (const controller of ['paud_assessments_controller.ts', 'report_cards_controller.ts']) {
      const source = await readProjectFile(`app/controllers/${controller}`)

      assert.notInclude(source, "from '#models/")
      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(
        source,
        /\b(?:PaudAssessment|AssessmentAttachment|SchoolClass|Student|Semester|LearningObjective|ReportNarrative)\.(?:find|findBy|findOrFail|create|updateOrCreate)\s*\(/
      )
    }

    assert.include(
      await readProjectFile('app/controllers/paud_assessments_controller.ts'),
      '#services/paud_assessment_service'
    )
    assert.include(
      await readProjectFile('app/controllers/report_cards_controller.ts'),
      '#services/report_card_service'
    )
  })

  test('keeps PAUD and report card persistence behind named repositories', async ({ assert }) => {
    const repositories: Record<string, string[]> = {
      'app/repositories/paud_assessment_repository.ts': [
        'getIndexData',
        'findTimeline',
        'findOwnedAssessment',
        'findBundle',
        'findOwnedClass',
        'findStudentInClass',
        'findAvailableLearningObjective',
        'findActiveSemester',
        'createWithAttachments',
        'deleteWithAttachments',
      ],
      'app/repositories/report_card_repository.ts': [
        'getIndexData',
        'findOwnedClass',
        'findSemester',
        'getNumericReportData',
        'getNarrativeReportData',
        'findStudentInClass',
        'findOwnedNarrative',
      ],
    }

    for (const [path, methods] of Object.entries(repositories)) {
      const source = await readProjectFile(path)
      for (const method of methods) {
        assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
      }
    }
  })

  test('keeps P11 services free of query builders and delegates persistence', async ({
    assert,
  }) => {
    for (const service of ['paud_assessment_service.ts', 'report_card_service.ts']) {
      const source = await readProjectFile(`app/services/${service}`)

      assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
      assert.notMatch(source, /\.query\s*\(/)
      assert.notMatch(source, /\b(?:whereHas|preload|groupBy|join|forUpdate|transaction)\s*\(/)
      assert.include(source, '#repositories/')
    }
  })
})
