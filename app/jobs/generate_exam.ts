import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { generateExam, type ExamGenerationOptions } from '#services/exam_generation_service'

export default class GenerateExam extends Job<ExamGenerationOptions> {
  static options: JobOptions = {
    queue: 'exam-generation',
    maxRetries: 1,
    timeout: '15m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    await generateExam(this.payload)
  }
}
