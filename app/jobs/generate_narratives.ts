import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { compileNarrativeReport } from '#services/report_card_service'
import { reportCardRepository } from '#repositories/report_card_repository'

interface GenerateNarrativesPayload {
  userId: number
  classId: number
  semesterId: number
}

export default class GenerateNarratives extends Job<GenerateNarrativesPayload> {
  static options: JobOptions = {
    queue: 'reports',
    maxRetries: 3,
    timeout: '2m',
    removeOnComplete: { age: '1h' },
    removeOnFail: { age: '1d' },
  }

  async execute() {
    const compiled = await compileNarrativeReport(
      this.payload.classId,
      this.payload.semesterId,
      this.payload.userId
    )
    const elements = [
      'Nilai Agama dan Budi Pekerti',
      'Jati Diri',
      'Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
    ]
    for (const student of compiled) {
      const evidence = student.entries
        .map((entry) => entry.content)
        .filter(Boolean)
        .map((content) =>
          Object.values(content)
            .filter((value) => typeof value === 'string' && value.trim())
            .join(' — ')
        )
        .filter(Boolean)
        .join('. ')
      for (const element of elements) {
        await reportCardRepository.upsertGeneratedNarrative({
          userId: this.payload.userId,
          classId: this.payload.classId,
          studentId: student.studentId,
          semesterId: this.payload.semesterId,
          element,
          content: evidence
            ? `Draft ${element.toLowerCase()} berdasarkan bukti observasi: ${evidence}.`
            : '',
          status: 'draft',
        })
      }
    }
  }
}
