import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { DateTime } from 'luxon'
import { API_KEY_PARAM, checkAuthAndAuthorize, authError, okResult, errorResult } from '../auth.js'
import { applyUserOrSchoolScope, checkAiRateLimit } from '../scoping.js'
import AnnualPlan from '#models/annual_plan'
import SemesterPlan from '#models/semester_plan'
import WeeklyLessonPlan from '#models/weekly_lesson_plan'
import DailyLessonPlan from '#models/daily_lesson_plan'
import TeachingModule from '#models/teaching_module'
import Lkpd from '#models/lkpd'
import MediaModule from '#models/media_module'
import AiJob from '#models/ai_job'
import SchoolClass from '#models/school_class'
import AcademicYear from '#models/academic_year'

import {
  exportAnnualPlan,
  exportSemesterPlan,
  exportWeeklyLessonPlan,
  exportDailyLessonPlan,
  exportTeachingModule,
  exportLkpd,
} from '#services/export_service'
import {
  exportAnnualPlanPdf,
  exportSemesterPlanPdf,
  exportWeeklyLessonPlanPdf,
  exportDailyLessonPlanPdf,
  exportTeachingModulePdf,
  exportLkpdPdf,
} from '#services/pdf_export_service'
import { exportMediaModulePptx, exportMediaModulePdf } from '#services/media_module_export_service'
import {
  annualPlanPrompt,
  semesterPlanPrompt,
  weeklyLessonPlanPrompt,
  dailyLessonPlanPrompt,
  teachingModulePrompt,
  lkpdPrompt,
  mediaModulePrompt,
} from '#services/ai_prompts'
import { getCurriculumContext } from '#services/curriculum_context_service'
import { callAiJsonForUser } from '#services/user_ai_service'
import { normalizeStringArraySections } from '#services/ai_service'
import { ensureDocumentWorkflow } from '#services/document_workflow_service'
import { EXPORT_CONTENT_TYPES, exportFilename } from '#services/export_file_service'

export function registerDocumentTools(server: McpServer) {
  // =========================================================================
  // 1. Annual Plans (Protah)
  // =========================================================================
  server.registerTool(
    'siapajar_list_annual_plans',
    {
      description: 'List annual plans (Protah).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().optional().describe('Filter by academic_year_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = AnnualPlan.query().preload('academicYear').preload('user')
        applyUserOrSchoolScope(query, ctx)

        if (args.academic_year_id) query.where('academic_year_id', args.academic_year_id)
        const plans = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: plans.length, annual_plans: plans.map((p) => p.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_annual_plan',
    {
      description: 'Get details of an annual plan by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Annual plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = AnnualPlan.query()
          .where('id', args.id)
          .preload('academicYear')
          .preload('user')

        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`Annual plan ID ${args.id} not found`)
        return okResult(plan.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_annual_plan',
    {
      description: 'Create an annual plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().describe('Academic year ID'),
        subject: z.string().min(1).describe('Subject name'),
        content: z.record(z.string(), z.unknown()).default({}).describe('Document JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await AnnualPlan.create({
          userId: ctx.user.id,
          academicYearId: args.academic_year_id,
          subject: args.subject,
          content: args.content,
        })
        return okResult({ message: 'Annual plan created', annual_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_annual_plan',
    {
      description: 'Update an annual plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Annual plan ID'),
        subject: z.string().optional().describe('Subject name'),
        content: z.record(z.string(), z.unknown()).optional().describe('Content JSON'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await AnnualPlan.find(args.id)
        if (!plan) return errorResult(`Annual plan ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own annual plans.')
        }

        if (args.subject !== undefined) plan.subject = args.subject
        if (args.content !== undefined) plan.content = args.content
        await plan.save()
        return okResult({ message: 'Annual plan updated', annual_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_annual_plan',
    {
      description: 'Delete an annual plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Annual plan ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await AnnualPlan.find(args.id)
        if (!plan) return errorResult(`Annual plan ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await plan.delete()
        return okResult({ message: `Annual plan ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_annual_plan',
    {
      description: 'Trigger AI generation for an annual plan (Protah).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().describe('Academic year ID'),
        subject: z.string().min(1).describe('Subject name'),
        learning_sequence_id: z.number().int().optional().describe('Optional learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const academicYear = await AcademicYear.find(args.academic_year_id)
        if (!academicYear) return errorResult(`Academic year ID ${args.academic_year_id} not found`)

        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = annualPlanPrompt({ subject: args.subject })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'kompetensi',
          'alokasiWaktu',
          'kegiatan',
          'minggu',
        ])
        content.curriculum = curriculum as any

        const annualPlan = await AnnualPlan.create({
          userId: user.id,
          academicYearId: args.academic_year_id,
          subject: args.subject,
          content,
        })
        return okResult({
          message: 'Annual plan generated successfully',
          annual_plan: annualPlan.toJSON(),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_annual_plan',
    {
      description: 'Export annual plan to DOCX file (returns base64 content).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Annual plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = AnnualPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`Annual plan ID ${args.id} not found`)
        const buffer = await exportAnnualPlan(plan, ctx.user)
        const filename = exportFilename(['Protah', plan.subject], 'docx')
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
    'siapajar_export_annual_plan_pdf',
    {
      description: 'Export annual plan to PDF file (returns base64 content).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Annual plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = AnnualPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`Annual plan ID ${args.id} not found`)
        const buffer = await exportAnnualPlanPdf(plan, ctx.user)
        const filename = exportFilename(['Protah', plan.subject], 'pdf')
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
  // 2. Semester Plans (Promes)
  // =========================================================================
  server.registerTool(
    'siapajar_list_semester_plans',
    {
      description: 'List semester plans (Promes).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        semester_id: z.number().int().optional().describe('Filter by semester_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SemesterPlan.query()
          .preload('schoolClass')
          .preload('semester')
          .preload('user')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.semester_id) query.where('semester_id', args.semester_id)
        const plans = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: plans.length, semester_plans: plans.map((p) => p.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_semester_plan',
    {
      description: 'Get details of a semester plan by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SemesterPlan.query()
          .where('id', args.id)
          .preload('schoolClass')
          .preload('semester')
          .preload('user')
        applyUserOrSchoolScope(query, ctx)

        const plan = await query.first()
        if (!plan) return errorResult(`Semester plan ID ${args.id} not found`)
        return okResult(plan.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_semester_plan',
    {
      description: 'Create a semester plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
        subject: z.string().min(1).describe('Subject name'),
        content: z.record(z.string(), z.unknown()).default({}).describe('JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await SemesterPlan.create({
          userId: ctx.user.id,
          classId: args.class_id,
          semesterId: args.semester_id,
          subject: args.subject,
          content: args.content,
        })
        return okResult({ message: 'Semester plan created', semester_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_semester_plan',
    {
      description: 'Update a semester plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester plan ID'),
        subject: z.string().optional().describe('Subject name'),
        content: z.record(z.string(), z.unknown()).optional().describe('JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await SemesterPlan.find(args.id)
        if (!plan) return errorResult(`Semester plan ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own semester plans.')
        }

        if (args.subject !== undefined) plan.subject = args.subject
        if (args.content !== undefined) plan.content = args.content
        await plan.save()
        return okResult({ message: 'Semester plan updated', semester_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_semester_plan',
    {
      description: 'Delete a semester plan.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester plan ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await SemesterPlan.find(args.id)
        if (!plan) return errorResult(`Semester plan ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await plan.delete()
        return okResult({ message: `Semester plan ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_semester_plan',
    {
      description: 'Trigger AI generation for a semester plan (Promes).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        semester_id: z.number().int().describe('Semester ID'),
        subject: z.string().min(1).describe('Subject name'),
        learning_sequence_id: z.number().int().optional().describe('Optional learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = semesterPlanPrompt({ subject: args.subject })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'alokasiWaktu',
          'materi',
          'kegiatan',
          'bulan',
        ])
        content.curriculum = curriculum as any

        const plan = await SemesterPlan.create({
          userId: user.id,
          classId: args.class_id,
          semesterId: args.semester_id,
          subject: args.subject,
          content,
        })
        return okResult({ message: 'Semester plan generated', semester_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_semester_plan',
    {
      description: 'Export semester plan to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SemesterPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`Semester plan ID ${args.id} not found`)
        const buffer = await exportSemesterPlan(plan, ctx.user)
        const filename = exportFilename(['Promes', plan.subject], 'docx')
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
    'siapajar_export_semester_plan_pdf',
    {
      description: 'Export semester plan to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SemesterPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`Semester plan ID ${args.id} not found`)
        const buffer = await exportSemesterPlanPdf(plan, ctx.user)
        const filename = exportFilename(['Promes', plan.subject], 'pdf')
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
  // 3. Weekly Lesson Plans (RPPM)
  // =========================================================================
  server.registerTool(
    'siapajar_list_weekly_lesson_plans',
    {
      description: 'List weekly lesson plans (RPPM).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = WeeklyLessonPlan.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const plans = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: plans.length, weekly_lesson_plans: plans.map((p) => p.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_weekly_lesson_plan',
    {
      description: 'Get details of a weekly lesson plan (RPPM) by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Weekly lesson plan ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = WeeklyLessonPlan.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const plan = await query.first()
        if (!plan) return errorResult(`Weekly lesson plan ID ${args.id} not found`)
        return okResult(plan.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_weekly_lesson_plan',
    {
      description: 'Update a weekly lesson plan (RPPM).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPM ID'),
        theme: z.string().optional().describe('Theme'),
        content: z.record(z.string(), z.unknown()).optional().describe('JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await WeeklyLessonPlan.find(args.id)
        if (!plan) return errorResult(`Weekly lesson plan ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own weekly lesson plans.')
        }

        if (args.theme !== undefined) plan.theme = args.theme
        if (args.content !== undefined) plan.content = args.content
        await plan.save()
        return okResult({
          message: 'Weekly lesson plan updated',
          weekly_lesson_plan: plan.toJSON(),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_weekly_lesson_plan',
    {
      description: 'Delete a weekly lesson plan (RPPM).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPM ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await WeeklyLessonPlan.find(args.id)
        if (!plan) return errorResult(`RPPM ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await plan.delete()
        return okResult({ message: `RPPM ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_weekly_lesson_plan',
    {
      description: 'Generate a weekly lesson plan (RPPM) using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        theme: z.string().min(1).describe('Theme name'),
        learning_sequence_id: z.number().int().optional().describe('Learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = weeklyLessonPlanPrompt({ theme: args.theme })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'kegiatanMain',
          'tujuanPembelajaran',
          'alatBahan',
        ])
        content.curriculum = curriculum as any

        const plan = await WeeklyLessonPlan.create({
          userId: user.id,
          classId: args.class_id,
          theme: args.theme,
          weekStartDate: DateTime.now(),
          content,
          status: 'draft',
        })
        return okResult({
          message: 'RPPM generated successfully',
          weekly_lesson_plan: plan.toJSON(),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_weekly_lesson_plan',
    {
      description: 'Export weekly lesson plan (RPPM) to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPM ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = WeeklyLessonPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`RPPM ID ${args.id} not found`)
        const buffer = await exportWeeklyLessonPlan(plan, ctx.user)
        const filename = exportFilename(['RPPM', plan.theme], 'docx')
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
    'siapajar_export_weekly_lesson_plan_pdf',
    {
      description: 'Export weekly lesson plan (RPPM) to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPM ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = WeeklyLessonPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`RPPM ID ${args.id} not found`)
        const buffer = await exportWeeklyLessonPlanPdf(plan, ctx.user)
        const filename = exportFilename(['RPPM', plan.theme], 'pdf')
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
  // 4. Daily Lesson Plans (RPPH)
  // =========================================================================
  server.registerTool(
    'siapajar_list_daily_lesson_plans',
    {
      description: 'List daily lesson plans (RPPH).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = DailyLessonPlan.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const plans = await query.orderBy('date', 'desc').limit(args.limit)
        return okResult({ count: plans.length, daily_lesson_plans: plans.map((p) => p.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_daily_lesson_plan',
    {
      description: 'Get details of a daily lesson plan (RPPH) by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPH ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = DailyLessonPlan.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const plan = await query.first()
        if (!plan) return errorResult(`RPPH ID ${args.id} not found`)
        return okResult(plan.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_daily_lesson_plan',
    {
      description: 'Update a daily lesson plan (RPPH).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPH ID'),
        date: z.string().optional().describe('Date YYYY-MM-DD'),
        content: z.record(z.string(), z.unknown()).optional().describe('JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await DailyLessonPlan.find(args.id)
        if (!plan) return errorResult(`RPPH ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own daily lesson plans.')
        }

        if (args.date !== undefined) plan.date = DateTime.fromISO(args.date)
        if (args.content !== undefined) plan.content = args.content
        await plan.save()
        return okResult({ message: 'Daily lesson plan updated', daily_lesson_plan: plan.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_daily_lesson_plan',
    {
      description: 'Delete a daily lesson plan (RPPH).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPH ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const plan = await DailyLessonPlan.find(args.id)
        if (!plan) return errorResult(`RPPH ID ${args.id} not found`)

        if (ctx.role === 'guru' && plan.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await plan.delete()
        return okResult({ message: `RPPH ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_daily_lesson_plan',
    {
      description: 'Generate a daily lesson plan (RPPH) using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        theme: z.string().min(1).describe('Theme name'),
        date: z.string().optional().describe('Date YYYY-MM-DD (defaults to today)'),
        learning_sequence_id: z.number().int().optional().describe('Learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const dateStr = args.date || new Date().toISOString().split('T')[0]
        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = dailyLessonPlanPrompt({ theme: args.theme, date: dateStr })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'pembukaan',
          'inti',
          'penutup',
          'asesmen',
        ])
        content.curriculum = curriculum as any

        const plan = await DailyLessonPlan.create({
          userId: user.id,
          classId: args.class_id,
          date: DateTime.fromISO(dateStr),
          content,
          status: 'draft',
        })
        return okResult({
          message: 'RPPH generated successfully',
          daily_lesson_plan: plan.toJSON(),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_daily_lesson_plan',
    {
      description: 'Export daily lesson plan (RPPH) to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPH ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = DailyLessonPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`RPPH ID ${args.id} not found`)
        const buffer = await exportDailyLessonPlan(plan, ctx.user)
        const filename = exportFilename(['RPPH', plan.date.toISODate() || ''], 'docx')
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
    'siapajar_export_daily_lesson_plan_pdf',
    {
      description: 'Export daily lesson plan (RPPH) to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('RPPH ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = DailyLessonPlan.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const plan = await query.first()
        if (!plan) return errorResult(`RPPH ID ${args.id} not found`)
        const buffer = await exportDailyLessonPlanPdf(plan, ctx.user)
        const filename = exportFilename(['RPPH', plan.date.toISODate() || ''], 'pdf')
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
  // 5. Teaching Modules (Modul Ajar)
  // =========================================================================
  server.registerTool(
    'siapajar_list_teaching_modules',
    {
      description: 'List teaching modules.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = TeachingModule.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const modules = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: modules.length, teaching_modules: modules.map((m) => m.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_teaching_module',
    {
      description: 'Get details of a teaching module by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Teaching module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = TeachingModule.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const module = await query.first()
        if (!module) return errorResult(`Teaching module ID ${args.id} not found`)
        return okResult(module.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_teaching_module',
    {
      description: 'Create a teaching module.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        title: z.string().min(1).describe('Title'),
        subject: z.string().min(1).describe('Subject name'),
        phase: z.string().optional().default('Fase Fondasi').describe('Curriculum phase'),
        content: z.record(z.string(), z.unknown()).default({}).describe('JSON content'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const module = await TeachingModule.create({
          userId: ctx.user.id,
          classId: args.class_id,
          title: args.title,
          subject: args.subject,
          phase: args.phase ?? 'Fase Fondasi',
          content: args.content,
          status: 'draft',
        })
        await ensureDocumentWorkflow(ctx.user.id, 'teaching_module', module.id, { status: 'draft' })
        return okResult({ message: 'Teaching module created', teaching_module: module.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_teaching_module',
    {
      description: 'Update a teaching module.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Teaching module ID'),
        title: z.string().optional().describe('Title'),
        subject: z.string().optional().describe('Subject'),
        phase: z.string().optional().describe('Phase'),
        content: z.record(z.string(), z.unknown()).optional().describe('JSON content'),
        status: z.enum(['draft', 'published']).optional().describe('Status'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const module = await TeachingModule.find(args.id)
        if (!module) return errorResult(`Teaching module ID ${args.id} not found`)

        if (ctx.role === 'guru' && module.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own teaching modules.')
        }

        if (args.title !== undefined) module.title = args.title
        if (args.subject !== undefined) module.subject = args.subject
        if (args.phase !== undefined) module.phase = args.phase
        if (args.content !== undefined) module.content = args.content
        if (args.status !== undefined) module.status = args.status
        await module.save()
        return okResult({ message: 'Teaching module updated', teaching_module: module.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_teaching_module',
    {
      description: 'Delete a teaching module.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Teaching module ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const module = await TeachingModule.find(args.id)
        if (!module) return errorResult(`Teaching module ID ${args.id} not found`)

        if (ctx.role === 'guru' && module.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await module.delete()
        return okResult({ message: `Teaching module ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_teaching_module',
    {
      description: 'Generate a teaching module (Modul Ajar) using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        subject: z.string().min(1).describe('Subject name'),
        topic: z.string().min(1).describe('Topic name'),
        phase: z.string().optional().default('Fase Fondasi').describe('Phase'),
        learning_sequence_id: z.number().int().optional().describe('Learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = teachingModulePrompt({
          subject: args.subject,
          topic: args.topic,
          phase: args.phase,
        })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'kompetensiDasar',
          'tujuanPembelajaran',
          'kegiatan',
          'penilaian',
          'sumberBelajar',
        ])
        content.curriculum = curriculum as any

        const module = await TeachingModule.create({
          userId: user.id,
          classId: args.class_id,
          title: `${args.subject} - ${args.topic}`,
          subject: args.subject,
          phase: args.phase ?? 'Fase Fondasi',
          content,
          status: 'draft',
        })
        await ensureDocumentWorkflow(user.id, 'teaching_module', module.id, { status: 'draft' })
        return okResult({ message: 'Teaching module generated', teaching_module: module.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_teaching_module',
    {
      description: 'Export teaching module to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Teaching module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = TeachingModule.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const module = await query.first()
        if (!module) return errorResult(`Teaching module ID ${args.id} not found`)
        const buffer = await exportTeachingModule(module, ctx.user)
        const filename = exportFilename(['Modul Ajar', module.title], 'docx')
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
    'siapajar_export_teaching_module_pdf',
    {
      description: 'Export teaching module to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Teaching module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = TeachingModule.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const module = await query.first()
        if (!module) return errorResult(`Teaching module ID ${args.id} not found`)
        const buffer = await exportTeachingModulePdf(module, ctx.user)
        const filename = exportFilename(['Modul Ajar', module.title], 'pdf')
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
  // 6. LKPDS
  // =========================================================================
  server.registerTool(
    'siapajar_list_lkpds',
    {
      description: 'List LKPD documents.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Lkpd.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const lkpds = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: lkpds.length, lkpds: lkpds.map((l) => l.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_lkpd',
    {
      description: 'Get LKPD details by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('LKPD ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Lkpd.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const lkpd = await query.first()
        if (!lkpd) return errorResult(`LKPD ID ${args.id} not found`)
        return okResult(lkpd.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_lkpd',
    {
      description: 'Delete an LKPD document.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('LKPD ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const lkpd = await Lkpd.find(args.id)
        if (!lkpd) return errorResult(`LKPD ID ${args.id} not found`)

        if (ctx.role === 'guru' && lkpd.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await lkpd.delete()
        return okResult({ message: `LKPD ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_lkpd',
    {
      description: 'Generate an LKPD (Lembar Kerja) document using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        title: z.string().min(1).describe('LKPD title'),
        subject: z.string().min(1).describe('Subject name'),
        grade_level: z.string().optional().default('TK B').describe('Grade level'),
        learning_sequence_id: z.number().int().optional().describe('Learning sequence ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const curriculum = await getCurriculumContext(user.id, args.learning_sequence_id)
        const prompt = lkpdPrompt({
          theme: args.title,
          ageGroup: args.grade_level,
          institutionType: user.institutionType ?? 'tk',
        })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const content = normalizeStringArraySections(raw, [
          'petunjuk',
          'langkahKegiatan',
          'soalPertanyaan',
        ])
        content.curriculum = curriculum as any

        const lkpd = await Lkpd.create({
          userId: user.id,
          classId: args.class_id,
          title: args.title,
          theme: args.subject,
          subtheme: null,
          ageGroup: args.grade_level ?? 'TK B',
          institutionType: user.institutionType ?? 'tk',
          content,
          status: 'draft',
        })
        return okResult({ message: 'LKPD generated successfully', lkpd: lkpd.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_lkpd',
    {
      description: 'Export LKPD to DOCX (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('LKPD ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Lkpd.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const lkpd = await query.first()
        if (!lkpd) return errorResult(`LKPD ID ${args.id} not found`)
        const buffer = await exportLkpd(lkpd, ctx.user)
        const filename = exportFilename(['LKPD', lkpd.title], 'docx')
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
    'siapajar_export_lkpd_pdf',
    {
      description: 'Export LKPD to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('LKPD ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Lkpd.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const lkpd = await query.first()
        if (!lkpd) return errorResult(`LKPD ID ${args.id} not found`)
        const buffer = await exportLkpdPdf(lkpd, ctx.user)
        const filename = exportFilename(['LKPD', lkpd.title], 'pdf')
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
  // 7. Media Modules (Media Ajar)
  // =========================================================================
  server.registerTool(
    'siapajar_list_media_modules',
    {
      description: 'List media modules (slides & loose parts guides).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = MediaModule.query().preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        if (args.class_id) query.where('class_id', args.class_id)
        const modules = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: modules.length, media_modules: modules.map((m) => m.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_media_module',
    {
      description: 'Get details of a media module by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Media module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = MediaModule.query().where('id', args.id).preload('schoolClass')
        applyUserOrSchoolScope(query, ctx)

        const module = await query.first()
        if (!module) return errorResult(`Media module ID ${args.id} not found`)
        return okResult(module.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_media_module',
    {
      description: 'Delete a media module.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Media module ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'documents',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const module = await MediaModule.find(args.id)
        if (!module) return errorResult(`Media module ID ${args.id} not found`)

        if (ctx.role === 'guru' && module.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await module.delete()
        return okResult({ message: `Media module ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_generate_media_module',
    {
      description: 'Generate media module (slides/loose parts guide) using AI.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        title: z.string().min(1).describe('Media title'),
        subject: z.string().min(1).describe('Subject name'),
        type: z
          .enum(['slide_outline', 'loose_parts_guide'])
          .optional()
          .default('slide_outline')
          .describe('Type of media'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      const rateLimit = checkAiRateLimit(ctx.user.id)
      if (!rateLimit.allowed) return errorResult(rateLimit.error!)

      try {
        const user = ctx.user
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class ID ${args.class_id} not found`)

        const prompt = mediaModulePrompt({
          theme: args.title,
          institutionType: user.institutionType ?? 'tk',
        })
        const raw = await callAiJsonForUser<Record<string, unknown>>(user, {
          combo: 'siapajar-docgen',
          systemPrompt: prompt.system,
          userPrompt: prompt.user,
        })
        const slides = Array.isArray((raw as any).slides) ? (raw as any).slides : []
        const loosePartsGuide =
          typeof (raw as any).loosePartsGuide === 'object' ? (raw as any).loosePartsGuide : {}

        const module = await MediaModule.create({
          userId: user.id,
          classId: args.class_id,
          title: args.title,
          theme: args.subject,
          subtheme: null,
          slides,
          loosePartsGuide,
          status: 'draft',
        })
        return okResult({
          message: 'Media module generated successfully',
          media_module: module.toJSON(),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_media_module_pptx',
    {
      description: 'Export media module to PPTX presentation (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Media module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = MediaModule.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const module = await query.first()
        if (!module) return errorResult(`Media module ID ${args.id} not found`)
        const buffer = await exportMediaModulePptx(module, ctx.user)
        const filename = exportFilename(['Media Ajar', module.title], 'pptx')
        return okResult({
          filename,
          mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          content_base64: buffer.toString('base64'),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_export_media_module_pdf',
    {
      description: 'Export media module to PDF (returns base64).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Media module ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = MediaModule.query().where('id', args.id)
        applyUserOrSchoolScope(query, ctx)
        const module = await query.first()
        if (!module) return errorResult(`Media module ID ${args.id} not found`)
        const buffer = await exportMediaModulePdf(module, ctx.user)
        const filename = exportFilename(['Media Ajar', module.title], 'pdf')
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
  // 8. AI Jobs Polling
  // =========================================================================
  server.registerTool(
    'siapajar_get_ai_job',
    {
      description: 'Get status and result of a background AI generation job.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().optional().describe('Job numeric ID'),
        job_key: z.string().optional().describe('Job hash key'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        let jobQuery = AiJob.query()
        applyUserOrSchoolScope(jobQuery, ctx)

        if (args.id) {
          jobQuery.where('id', args.id)
        } else if (args.job_key) {
          jobQuery.where('jobKey', args.job_key)
        } else {
          return errorResult('Must provide either id or job_key')
        }
        const job = await jobQuery.first()
        if (!job) return errorResult('AI job not found')
        return okResult(job.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_ai_jobs',
    {
      description: 'List background AI jobs with optional status filter.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        status: z
          .enum(['pending', 'processing', 'completed', 'failed'])
          .optional()
          .describe('Filter by status'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'documents',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = AiJob.query()
        applyUserOrSchoolScope(query, ctx)

        if (args.status) query.where('status', args.status)
        const jobs = await query.orderBy('created_at', 'desc').limit(args.limit)
        return okResult({ count: jobs.length, jobs: jobs.map((j) => j.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )
}
