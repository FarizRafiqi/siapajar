import DailyLessonPlan from '#models/daily_lesson_plan'
import Lkpd from '#models/lkpd'
import MediaModule from '#models/media_module'
import TeachingModule from '#models/teaching_module'
import type { DocumentType } from '#models/document_workflow'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'

export class DocumentRepository {
  async findDocument(type: DocumentType, id: number, userId: number): Promise<any | null> {
    const model = this.modelFor(type)
    return model.query().where('id', id).where('user_id', userId).first()
  }

  async clone(type: DocumentType, source: any, userId: number): Promise<any> {
    if (type === 'teaching_module') {
      return TeachingModule.create({
        userId,
        classId: source.classId,
        title: `${source.title} (Copy)`,
        subject: source.subject,
        phase: source.phase,
        content: source.content ?? {},
        status: 'draft',
      })
    }

    if (type === 'rppm') {
      return WeeklyLessonPlan.create({
        userId,
        classId: source.classId,
        theme: `${source.theme} (Copy)`,
        weekStartDate: source.weekStartDate,
        content: source.content ?? {},
        status: 'draft',
      })
    }

    if (type === 'rpph') {
      return DailyLessonPlan.create({
        userId,
        classId: source.classId,
        weeklyLessonPlanId: source.weeklyLessonPlanId,
        date: source.date,
        content: source.content ?? {},
        status: 'draft',
      })
    }

    if (type === 'lkpd') {
      return Lkpd.create({
        userId,
        classId: source.classId,
        title: `${source.title} (Copy)`,
        theme: source.theme,
        subtheme: source.subtheme,
        ageGroup: source.ageGroup,
        institutionType: source.institutionType,
        content: source.content ?? {},
        status: 'draft',
      })
    }

    return MediaModule.create({
      userId,
      classId: source.classId,
      title: `${source.title} (Copy)`,
      theme: source.theme,
      subtheme: source.subtheme,
      slides: source.slides ?? [],
      loosePartsGuide: source.loosePartsGuide ?? null,
      status: 'draft',
    })
  }

  private modelFor(type: DocumentType) {
    return type === 'teaching_module'
      ? TeachingModule
      : type === 'rppm'
        ? WeeklyLessonPlan
        : type === 'rpph'
          ? DailyLessonPlan
          : type === 'lkpd'
            ? Lkpd
            : MediaModule
  }
}

export const documentRepository = new DocumentRepository()
