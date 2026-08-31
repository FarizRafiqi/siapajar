import Subject from '#models/subject'
import { subjectRepository } from '#repositories/subject_repository'
import type { SubjectRepository } from '#repositories/subject_repository'

export const DEFAULT_SUBJECTS: Record<'tk' | 'sd', string[]> = {
  tk: [
    'Bahasa',
    'Bahasa Inggris',
    'Moral Agama / P.A.I',
    'Bahasa Arab',
    'Kognitif',
    'Sains',
    'Mewarnai / Seni',
  ],
  sd: [
    'Bahasa Indonesia',
    'Matematika',
    'IPAS',
    'PPKn',
    'Bahasa Inggris',
    'Seni Budaya',
    'PJOK',
    'Muatan Lokal',
  ],
}

export class SubjectService {
  constructor(private readonly subjects: SubjectRepository = subjectRepository) {}

  async listForUser(userId: number, educationLevel: 'tk' | 'sd') {
    return this.subjects.listForUser(userId, educationLevel)
  }

  async create(userId: number, data: Record<string, any>) {
    const duplicate = await this.subjects.findDuplicate(userId, data.name, data.educationLevel)
    if (duplicate) return false

    await Subject.create({ ...data, userId })
    return true
  }

  async storeDefaults(userId: number, educationLevel: string | null) {
    const level = (educationLevel || 'sd') as 'tk' | 'sd'
    await this.subjects.replaceWithDefaults(userId, level, DEFAULT_SUBJECTS[level])
    return DEFAULT_SUBJECTS[level].length
  }

  async update(userId: number, subjectId: string | number, data: Record<string, any>) {
    const subject = await this.subjects.findOwnedById(userId, subjectId)
    if (!subject) return false
    await subject.merge(data).save()
    return true
  }

  async delete(userId: number, subjectId: string | number) {
    const subject = await this.subjects.findOwnedById(userId, subjectId)
    if (!subject) return false
    await subject.delete()
    return true
  }
}

export const subjectService = new SubjectService()
