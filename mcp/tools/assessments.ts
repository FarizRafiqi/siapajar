import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { DateTime } from 'luxon'
import { API_KEY_PARAM, checkAuthAndAuthorize, authError, okResult, errorResult } from '../auth.js'
import { applyUserOrSchoolScope, checkAiRateLimit } from '../scoping.js'
import PaudAssessment from '#models/paud_assessment'
import ReportNarrative from '#models/report_narrative'
import Exam from '#models/exam'
import Assessment from '#models/assessment'
import Score from '#models/score'
import SchoolClass from '#models/school_class'
import Semester from '#models/semester'

import {
  exportPaudAssessment,
  exportPaudAssessmentBundle,
  exportExam,
  exportAssessment,
  exportNarrativeReport,
  exportStudentReport,
} from '#services/export_service'
import {
  exportPaudAssessmentPdf,
  exportPaudAssessmentBundlePdf,
  exportExamPdf,
  exportAssessmentPdf,
  exportNarrativeReportPdf,
  exportReportCardPdf,
} from '#services/pdf_export_service'
import { paudAssessmentAiService } from '#services/paud_assessment_ai_service'
import { exportAssessmentScores } from '#services/xlsx_export_service'
import { computeClassReportCard, compileNarrativeReport } from '#services/report_card_service'
import { examPrompt } from '#services/ai_prompts'
import { callAiJsonForUser } from '#services/user_ai_service'
import GenerateNarratives from '#jobs/generate_narratives'
import { EXPORT_CONTENT_TYPES, exportFilename } from '#services/export_file_service'

export function registerAssessmentTools(server: McpServer) {
  // =========================================================================
  // 1. PAUD Assessments
  // =========================================================================
  server.registerTool(
    'siapajar_list_paud_assessments',
    {
      description: 'List PAUD assessments (ceklis, anekdot, hasil karya, foto berseri).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        student_id: z.number().int().optional().describe('Filter by student_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query().preload('student').preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.student_id) query.where('student_id', args.student_id)
        const items = await query.orderBy('date', 'desc').limit(args.limit)
        return okResult({ count: items.length, paud_assessments: items.map((i) => i.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_paud_assessment',
    {
      description: 'Get details of a PAUD assessment by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('PAUD assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query()
          .where('id', args.id)
          .preload('student')
          .preload('schoolClass')
          .preload('attachments')
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`PAUD assessment ID ${args.id} not found`)
        return okResult(item.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_paud_assessment',
    {
      description: 'Create a PAUD assessment record.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        student_id: z.number().int().describe('Student ID'),
        type: z
          .enum(['checklist', 'anecdotal_note', 'work_sample', 'photo_series'])
          .describe('Assessment type'),
        title: z.string().min(1).describe('Assessment title'),
        date: z.string().optional().describe('Date YYYY-MM-DD'),
        content: z
          .record(z.string(), z.unknown())
          .default({})
          .describe('Assessment payload content'),
        notes: z.string().optional().describe('Teacher notes'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const dateStr = args.date || new Date().toISOString().split('T')[0]
        const item = await PaudAssessment.create({
          userId: ctx.user.id,
          classId: args.class_id,
          studentId: args.student_id,
          type: args.type,
          date: DateTime.fromISO(dateStr),
          content: args.content,
          teacherNote: args.notes ?? null,
        })
        return okResult({ message: 'PAUD assessment created', paud_assessment: item.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_paud_assessment',
    {
      description: 'Update a PAUD assessment.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('PAUD assessment ID'),
        date: z.string().optional().describe('Date YYYY-MM-DD'),
        content: z.record(z.string(), z.unknown()).optional().describe('Content'),
        notes: z.string().optional().describe('Notes'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const item = await PaudAssessment.find(args.id)
        if (!item) return errorResult(`PAUD assessment ID ${args.id} not found`)

        if (ctx.role === 'guru' && item.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own PAUD assessments.')
        }

        if (args.date !== undefined) item.date = DateTime.fromISO(args.date)
        if (args.content !== undefined) item.content = args.content
        if (args.notes !== undefined) item.teacherNote = args.notes
        await item.save()
        return okResult({ message: 'PAUD assessment updated', paud_assessment: item.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_paud_assessment',
    {
      description: 'Delete a PAUD assessment.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('PAUD assessment ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'assessments',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const item = await PaudAssessment.find(args.id)
        if (!item) return errorResult(`PAUD assessment ID ${args.id} not found`)

        if (ctx.role === 'guru' && item.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await item.delete()
        return okResult({ message: `PAUD assessment ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_paud_assessment',
    {
      description: 'Export PAUD assessment to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('PAUD assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const item = await query.first()
        if (!item) return errorResult(`PAUD assessment ID ${args.id} not found`)
        const buffer = await exportPaudAssessment(item, ctx.user)
        const filename = exportFilename(['Asesmen PAUD', String(item.id)], 'docx')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.docx,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_paud_assessment_pdf',
    {
      description: 'Export PAUD assessment to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('PAUD assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const item = await query.first()
        if (!item) return errorResult(`PAUD assessment ID ${args.id} not found`)
        const buffer = await exportPaudAssessmentPdf(item, ctx.user)
        const filename = exportFilename(['Asesmen PAUD', String(item.id)], 'pdf')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.pdf,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_paud_assessment_bundle',
    {
      description:
        'Export all PAUD assessments for a class/theme into a PPM KBC bundle DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Class ID'),
        theme: z.string().default('Kenalkan').describe('Theme / Topik name'),
        start_date: z.string().optional().describe('Start date YYYY-MM-DD'),
        end_date: z.string().optional().describe('End date YYYY-MM-DD'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query()
          .preload('student')
          .preload('schoolClass')
          .preload('attachments')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.start_date && args.end_date) {
          query.whereBetween('date', [
            DateTime.fromISO(args.start_date).toSQLDate()!,
            DateTime.fromISO(args.end_date).toSQLDate()!,
          ])
        }

        const items = await query.orderBy('date', 'asc')
        const buffer = await exportPaudAssessmentBundle(items, ctx.user, args.theme)
        const filename = exportFilename(['Asesmen RA', args.theme, 'Bundle'], 'docx')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.docx,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_paud_assessment_bundle_pdf',
    {
      description:
        'Export all PAUD assessments for a class/theme into a PPM KBC bundle PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Class ID'),
        theme: z.string().default('Kenalkan').describe('Theme / Topik name'),
        start_date: z.string().optional().describe('Start date YYYY-MM-DD'),
        end_date: z.string().optional().describe('End date YYYY-MM-DD'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = PaudAssessment.query()
          .preload('student')
          .preload('schoolClass')
          .preload('attachments')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.start_date && args.end_date) {
          query.whereBetween('date', [
            DateTime.fromISO(args.start_date).toSQLDate()!,
            DateTime.fromISO(args.end_date).toSQLDate()!,
          ])
        }

        const items = await query.orderBy('date', 'asc')
        const buffer = await exportPaudAssessmentBundlePdf(items, ctx.user, args.theme, false)
        const filename = exportFilename(['Asesmen RA', args.theme, 'Bundle'], 'pdf')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.pdf,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_paud_assessment_ai',
    {
      description:
        'Draft PAUD assessment observations and analyses using AI (Token-Optimized TOON format).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        type: z
          .enum(['checklist', 'anecdotal_note', 'work_sample', 'photo_series'])
          .describe('Assessment type'),
        student_name: z.string().optional().describe('Student name'),
        class_name: z.string().optional().describe('Class name'),
        theme: z.string().optional().describe('Theme / Topik name'),
        context: z.string().optional().describe('Context / Setting (for anecdotal)'),
        observed_notes: z.string().optional().describe('Rough observation notes (for anecdotal)'),
        learning_objective: z.string().optional().describe('Learning objective (for checklist)'),
        target_indicators: z
          .array(z.string())
          .optional()
          .describe('Target indicators list (for checklist)'),
        rough_notes: z.string().optional().describe('General notes (for checklist)'),
        work_title: z.string().optional().describe('Work title (for work sample)'),
        child_quotes: z
          .string()
          .optional()
          .describe('Child quotes / description (for work sample)'),
        activity_title: z.string().optional().describe('Activity title (for photo series)'),
        stage_notes: z.string().optional().describe('Stage notes (for photo series)'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        let result: any = {}
        if (args.type === 'anecdotal_note') {
          result = await paudAssessmentAiService.generateAnecdotal(ctx.user, {
            studentName: args.student_name,
            className: args.class_name,
            theme: args.theme,
            context: args.context,
            observedBehaviorNotes: args.observed_notes || 'Anak aktif bermain bersama kelompok',
          })
        } else if (args.type === 'checklist') {
          result = await paudAssessmentAiService.generateChecklist(ctx.user, {
            studentName: args.student_name,
            className: args.class_name,
            theme: args.theme,
            learningObjective: args.learning_objective,
            targetIndicators: args.target_indicators,
            roughNotes: args.rough_notes,
          })
        } else if (args.type === 'work_sample') {
          result = await paudAssessmentAiService.generateWorkSample(ctx.user, {
            studentName: args.student_name,
            className: args.class_name,
            theme: args.theme,
            workTitle: args.work_title || 'Karya Anak',
            childQuotesOrDescription: args.child_quotes,
          })
        } else if (args.type === 'photo_series') {
          result = await paudAssessmentAiService.generatePhotoSeries(ctx.user, {
            studentName: args.student_name,
            className: args.class_name,
            theme: args.theme,
            activityTitle: args.activity_title || 'Aktivitas Anak',
            stageNotes: args.stage_notes,
          })
        }

        return okResult({ type: args.type, generated_content: result })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // =========================================================================
  // 2. Report Narratives & Report Cards
  // =========================================================================
  server.registerTool(
    'siapajar_list_report_narratives',
    {
      description: 'List report narratives for students.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        semester_id: z.number().int().optional().describe('Filter by semester_id'),
        student_id: z.number().int().optional().describe('Filter by student_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = ReportNarrative.query()
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.semester_id) query.where('semester_id', args.semester_id)
        if (args.student_id) query.where('student_id', args.student_id)
        const items = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: items.length, report_narratives: items.map((i) => i.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_report_narrative',
    {
      description: 'Get details of a report narrative by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Report narrative ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = ReportNarrative.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`Report narrative ID ${args.id} not found`)
        return okResult(item.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_report_narratives',
    {
      description:
        'Trigger background job to generate narrative report drafts for a class and semester.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const { jobId } = await GenerateNarratives.dispatch({
          userId: user.id,
          classId: args.class_id,
          semesterId: args.semester_id,
        }).dedup({ id: `narratives:${user.id}:${args.class_id}:${args.semester_id}`, ttl: '5m' })

        return okResult({
          message: 'Report narrative generation job enqueued',
          job_id: jobId,
          class_id: args.class_id,
          semester_id: args.semester_id,
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_report_cards',
    {
      description:
        'Get compiled report cards for a class and semester (narrative for TK/PAUD or numeric for SD).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        if (user.isTk) {
          const narratives = await compileNarrativeReport(args.class_id, args.semester_id, user.id)
          return okResult({
            mode: 'narrative',
            class_id: args.class_id,
            semester_id: args.semester_id,
            reports: narratives,
          })
        } else {
          const report = await computeClassReportCard(args.class_id, args.semester_id, user.id)
          return okResult({
            mode: 'numeric',
            class_id: args.class_id,
            semester_id: args.semester_id,
            report,
          })
        }
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_report_card',
    {
      description: 'Get report card of a specific student in a class & semester.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
        student_id: z.number().int().describe('Student ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const user = ctx.user
        if (user.isTk) {
          const narratives = await compileNarrativeReport(args.class_id, args.semester_id, user.id)
          const studentNarrative = narratives.find((n) => n.studentId === args.student_id)
          if (!studentNarrative)
            return errorResult(`Narrative report for student ${args.student_id} not found`)
          return okResult({ mode: 'narrative', student_report: studentNarrative })
        } else {
          const { students } = await computeClassReportCard(
            args.class_id,
            args.semester_id,
            user.id
          )
          const studentReport = students.find((s) => s.studentId === args.student_id)
          if (!studentReport)
            return errorResult(`Report card for student ${args.student_id} not found`)
          return okResult({ mode: 'numeric', student_report: studentReport })
        }
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_report_card_pdf',
    {
      description: 'Export student report card to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
        student_id: z.number().int().describe('Student ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        const semester = await Semester.query()
          .where('id', args.semester_id)
          .preload('academicYear')
          .first()
        if (!schoolClass || !semester) return errorResult('Class or semester not found')

        const semesterLabel = `${semester.name} ${semester.academicYear?.name || ''}`

        if (user.isTk) {
          const narratives = await compileNarrativeReport(args.class_id, args.semester_id, user.id)
          const studentNarrative = narratives.find((n) => n.studentId === args.student_id)
          if (!studentNarrative)
            return errorResult(`Student narrative ID ${args.student_id} not found`)

          const buffer = await exportNarrativeReportPdf(studentNarrative, user, {
            className: schoolClass.name,
            semesterLabel,
            totalStudents: narratives.length,
          })
          const filename = exportFilename(
            ['Rapor Perkembangan', studentNarrative.fullName, semesterLabel],
            'pdf'
          )
          return okResult({
            filename,
            mime_type: EXPORT_CONTENT_TYPES.pdf,
            content_base64: buffer.toString('base64'),
          })
        } else {
          const { students } = await computeClassReportCard(
            args.class_id,
            args.semester_id,
            user.id
          )
          const studentReport = students.find((s) => s.studentId === args.student_id)
          if (!studentReport) return errorResult(`Student report ID ${args.student_id} not found`)

          const buffer = await exportReportCardPdf(studentReport, user, {
            className: schoolClass.name,
            semesterLabel,
            totalStudents: students.length,
          })
          const filename = exportFilename(['Rapor', studentReport.fullName, semesterLabel], 'pdf')
          return okResult({
            filename,
            mime_type: EXPORT_CONTENT_TYPES.pdf,
            content_base64: buffer.toString('base64'),
          })
        }
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_report_card_docx',
    {
      description: 'Export student report card to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
        student_id: z.number().int().describe('Student ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        const semester = await Semester.query()
          .where('id', args.semester_id)
          .preload('academicYear')
          .first()
        if (!schoolClass || !semester) return errorResult('Class or semester not found')

        const semesterLabel = `${semester.name} ${semester.academicYear?.name || ''}`

        if (user.isTk) {
          const narratives = await compileNarrativeReport(args.class_id, args.semester_id, user.id)
          const studentNarrative = narratives.find((n) => n.studentId === args.student_id)
          if (!studentNarrative)
            return errorResult(`Student narrative ID ${args.student_id} not found`)

          const buffer = await exportNarrativeReport(studentNarrative, user, {
            className: schoolClass.name,
            semesterLabel,
          })
          const filename = exportFilename(
            ['Rapor Perkembangan', studentNarrative.fullName, semesterLabel],
            'docx'
          )
          return okResult({
            filename,
            mime_type: EXPORT_CONTENT_TYPES.docx,
            content_base64: buffer.toString('base64'),
          })
        } else {
          const { students } = await computeClassReportCard(
            args.class_id,
            args.semester_id,
            user.id
          )
          const studentReport = students.find((s) => s.studentId === args.student_id)
          if (!studentReport) return errorResult(`Student report ID ${args.student_id} not found`)

          const buffer = await exportStudentReport(studentReport, user, {
            className: schoolClass.name,
            semesterLabel,
            totalStudents: students.length,
          })
          const filename = exportFilename(['Rapor', studentReport.fullName, semesterLabel], 'docx')
          return okResult({
            filename,
            mime_type: EXPORT_CONTENT_TYPES.docx,
            content_base64: buffer.toString('base64'),
          })
        }
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // =========================================================================
  // 3. Exams
  // =========================================================================
  server.registerTool(
    'siapajar_list_exams',
    {
      description: 'List exams (soal ujian/ulangan).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Exam.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const exams = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: exams.length, exams: exams.map((e) => e.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_exam',
    {
      description: 'Get details of an exam by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Exam ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Exam.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const exam = await query.first()
        if (!exam) return errorResult(`Exam ID ${args.id} not found`)
        return okResult(exam.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_exam',
    {
      description: 'Create an exam.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        title: z.string().min(1).describe('Exam title'),
        subject: z.string().min(1).describe('Subject name'),
        exam_type: z
          .enum(['midterm', 'final', 'daily', 'summative'])
          .optional()
          .default('daily')
          .describe('Exam type'),
        questions: z
          .array(z.record(z.string(), z.unknown()))
          .default([])
          .describe('Questions array'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const exam = await Exam.create({
          userId: ctx.user.id,
          classId: args.class_id,
          title: args.title,
          type: args.exam_type ?? 'daily',
          questions: args.questions,
          header: { subject: args.subject },
          status: 'draft',
        })
        return okResult({ message: 'Exam created', exam: exam.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_exam',
    {
      description: 'Update an exam.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Exam ID'),
        title: z.string().optional().describe('Title'),
        subject: z.string().optional().describe('Subject'),
        exam_type: z
          .enum(['midterm', 'final', 'daily', 'summative'])
          .optional()
          .describe('Exam type'),
        questions: z
          .array(z.record(z.string(), z.unknown()))
          .optional()
          .describe('Questions array'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const exam = await Exam.find(args.id)
        if (!exam) return errorResult(`Exam ID ${args.id} not found`)

        if (ctx.role === 'guru' && exam.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own exams.')
        }

        if (args.title !== undefined) exam.title = args.title
        if (args.exam_type !== undefined) exam.type = args.exam_type
        if (args.questions !== undefined) exam.questions = args.questions
        if (args.subject !== undefined) {
          exam.header = { ...(exam.header || {}), subject: args.subject }
        }
        await exam.save()
        return okResult({ message: 'Exam updated', exam: exam.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_exam',
    {
      description: 'Delete an exam.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Exam ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'assessments',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const exam = await Exam.find(args.id)
        if (!exam) return errorResult(`Exam ID ${args.id} not found`)

        if (ctx.role === 'guru' && exam.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await exam.delete()
        return okResult({ message: `Exam ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_exam',
    {
      description: 'Generate an exam (soal) using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        subject: z.string().min(1).describe('Subject name'),
        grade_level: z.number().int().optional().default(1).describe('Grade level'),
        exam_type: z
          .enum(['midterm', 'final', 'daily', 'summative'])
          .optional()
          .default('daily')
          .describe('Exam type'),
        total_questions: z.number().int().optional().default(10).describe('Total questions count'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const prompt = examPrompt({
          subject: args.subject,
          topic: args.subject,
          type: args.exam_type ?? 'daily',
          questionCount: args.total_questions ?? 10,
        })
        const content = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })

        const questions = Array.isArray((content as any).questions)
          ? (content as any).questions
          : []

        const exam = await Exam.create({
          userId: user.id,
          classId: args.class_id,
          title: `Soal ${args.subject} (${args.exam_type ?? 'daily'})`,
          type: args.exam_type ?? 'daily',
          questions,
          header: { subject: args.subject },
          status: 'draft',
        })
        return okResult({ message: 'Exam generated successfully', exam: exam.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_exam',
    {
      description: 'Export exam to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Exam ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Exam.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const exam = await query.first()
        if (!exam) return errorResult(`Exam ID ${args.id} not found`)
        const buffer = await exportExam(exam, ctx.user)
        const filename = exportFilename(['Soal', exam.title], 'docx')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.docx,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_exam_pdf',
    {
      description: 'Export exam to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Exam ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Exam.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const exam = await query.first()
        if (!exam) return errorResult(`Exam ID ${args.id} not found`)
        const buffer = await exportExamPdf(exam, ctx.user)
        const filename = exportFilename(['Soal', exam.title], 'pdf')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.pdf,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // =========================================================================
  // 4. Assessments & Scores
  // =========================================================================
  server.registerTool(
    'siapajar_list_assessments',
    {
      description: 'List assessments (gradebook assessments).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Assessment.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const items = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: items.length, assessments: items.map((i) => i.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_assessment',
    {
      description: 'Get assessment details including student scores.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Assessment.query()
          .where('id', args.id)
          .preload('schoolClass')
          .preload('scores', (q) => q.preload('student'))
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`Assessment ID ${args.id} not found`)
        return okResult(item.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_assessment',
    {
      description: 'Create an assessment entry for a class & subject.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        subject: z.string().min(1).describe('Subject name (e.g. Matematika)'),
        title: z.string().min(1).describe('Assessment title'),
        type: z
          .enum(['formative', 'summative'])
          .optional()
          .default('formative')
          .describe('Assessment type'),
        date: z.string().optional().describe('Date YYYY-MM-DD'),
        semester_id: z.number().int().optional().describe('Semester ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const dateStr = args.date || new Date().toISOString().split('T')[0]
        const item = await Assessment.create({
          userId: ctx.user.id,
          classId: args.class_id,
          semesterId: args.semester_id ?? null,
          subject: args.subject,
          title: args.title,
          type: args.type ?? 'formative',
          date: DateTime.fromISO(dateStr),
        })
        return okResult({ message: 'Assessment created', assessment: item.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_assessment_scores',
    {
      description: 'Batch update student scores for an assessment.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
        scores: z
          .array(
            z.object({
              student_id: z.number().int().describe('Student ID'),
              score: z.number().min(0).max(100).describe('Numeric score 0-100'),
              notes: z.string().optional().describe('Optional notes'),
            })
          )
          .describe('List of student scores'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const assessment = await Assessment.find(args.id)
        if (!assessment) return errorResult(`Assessment ID ${args.id} not found`)

        if (ctx.role === 'guru' && assessment.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update scores for your own assessments.')
        }

        for (const item of args.scores) {
          await Score.updateOrCreate(
            { assessmentId: assessment.id, studentId: item.student_id },
            {
              assessmentId: assessment.id,
              studentId: item.student_id,
              value: item.score,
              note: item.notes ?? null,
            }
          )
        }

        const updated = await Assessment.query().where('id', args.id).preload('scores').first()
        return okResult({ message: 'Assessment scores updated', assessment: updated?.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_assessment',
    {
      description: 'Delete an assessment and its scores.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'assessments',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const item = await Assessment.find(args.id)
        if (!item) return errorResult(`Assessment ID ${args.id} not found`)

        if (ctx.role === 'guru' && item.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await item.delete()
        return okResult({ message: `Assessment ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_assessment',
    {
      description: 'Export assessment scores to Excel XLSX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Assessment.query()
          .where('id', args.id)
          .preload('schoolClass')
          .preload('scores', (q) => q.preload('student'))
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`Assessment ID ${args.id} not found`)

        const buffer = await exportAssessmentScores(item, ctx.user)
        const filename = exportFilename(['Penilaian', item.title], 'xlsx')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.xlsx,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_assessment_docx',
    {
      description: 'Export assessment to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Assessment.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`Assessment ID ${args.id} not found`)

        const buffer = await exportAssessment(item, ctx.user)
        const filename = exportFilename(['Penilaian', item.title], 'docx')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.docx,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_assessment_pdf',
    {
      description: 'Export assessment to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Assessment ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'assessments',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Assessment.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)

        const item = await query.first()
        if (!item) return errorResult(`Assessment ID ${args.id} not found`)

        const buffer = await exportAssessmentPdf(item, ctx.user)
        const filename = exportFilename(['Penilaian', item.title], 'pdf')
        return okResult({
          filename,
          mime_type: EXPORT_CONTENT_TYPES.pdf,
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )
}
