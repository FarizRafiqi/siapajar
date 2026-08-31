import { test } from '@japa/runner'
import { readFile } from 'node:fs/promises'

async function readProjectFile(path: string): Promise<string> {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test.group('P6 classes and students layering', () => {
  test('keeps class controller free of persistence code', async ({ assert }) => {
    const source = await readProjectFile('app/controllers/classes_controller.ts')

    assert.notInclude(source, "from '#models/")
    assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(source, /\.query\s*\(/)
    assert.notMatch(source, /\b(?:find|findBy|findOrFail|create|save|delete|load|preload)\s*\(/)
    assert.include(source, '#services/classes_service')
  })

  test('keeps class and student queries behind named repository methods', async ({ assert }) => {
    const source = await readProjectFile('app/repositories/class_repository.ts')
    for (const method of [
      'listOwnedClasses',
      'findOwnedClass',
      'findLatestPlanForClass',
      'findClassDuplicate',
      'findStudentForUser',
      'findStudentDuplicate',
      'getStudentsData',
      'importStudents',
    ]) {
      assert.match(source, new RegExp(`(?:async )?${method}\\s*\\(`))
    }
  })

  test('keeps class service focused on business orchestration', async ({ assert }) => {
    const source = await readProjectFile('app/services/classes_service.ts')

    assert.notInclude(source, "from '@adonisjs/lucid/services/db'")
    assert.notMatch(source, /\b(?:whereHas|preload|forUpdate|groupBy|join)\s*\(/)
    assert.notInclude(source, 'PaudAssessment.query()')
    assert.notInclude(source, "Student.query().where('class_id', classId)")
    assert.include(source, '#repositories/class_repository')
  })

  test('allows simple class and student persistence operations in the service', async ({
    assert,
  }) => {
    const source = await readProjectFile('app/services/classes_service.ts')

    assert.include(source, 'SchoolClass.create')
    assert.include(source, 'Student.create')
    assert.include(source, '.save()')
  })

  test('keeps bulk student import persistence behind the repository', async ({ assert }) => {
    const service = await readProjectFile('app/services/classes_service.ts')
    const repository = await readProjectFile('app/repositories/class_repository.ts')

    assert.include(service, 'this.repository.importStudents')
    assert.notInclude(service, 'const existingStudents = await Student.query()')
    assert.include(repository, "Student.query().where('class_id', classId)")
  })
})
