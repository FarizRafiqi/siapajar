import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  API_KEY_PARAM,
  checkAuth,
  authError,
  okResult,
  errorResult,
  getEffectiveUser,
} from '../auth.js'
import CurriculumCp from '#models/curriculum_cp'
import LearningObjective from '#models/learning_objective'
import LearningSequence from '#models/learning_sequence'
import IktpIndicator from '#models/iktp_indicator'
import { PAUD_CURRICULUM_PRESETS } from '#services/curriculum_presets'

export function registerCurriculumTools(server: McpServer) {
  server.registerTool(
    'siapajar_list_curriculum_cps',
    {
      description: 'List official Curriculum Capaian Pembelajaran (CP) Fase Fondasi.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = checkAuth(args)
      if (!auth.ok) return authError(auth.error)
      try {
        const cps = await CurriculumCp.query()
          .preload('learningObjectives', (q) => q.preload('indicators'))
          .orderBy('id', 'asc')
          .limit(args.limit)
        return okResult({ count: cps.length, curriculum_cps: cps.map((cp) => cp.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_learning_objectives',
    {
      description: 'List Learning Objectives (Tujuan Pembelajaran - TP).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        cp_id: z.number().int().optional().describe('Filter by CP ID'),
        user_id: z.number().int().optional().describe('Filter by user_id'),
        limit: z.number().int().min(1).max(200).default(100).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = checkAuth(args)
      if (!auth.ok) return authError(auth.error)
      try {
        const query = LearningObjective.query().preload('cp').preload('indicators')
        if (args.cp_id) query.where('cp_id', args.cp_id)
        if (args.user_id) {
          const uid = args.user_id
          query.where((q) => q.whereNull('user_id').orWhere('user_id', uid))
        }
        const objectives = await query.orderBy('id', 'asc').limit(args.limit)
        return okResult({
          count: objectives.length,
          learning_objectives: objectives.map((o) => o.toJSON()),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_learning_sequences',
    {
      description: 'List Learning Sequences (Alur Tujuan Pembelajaran - ATP).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        user_id: z.number().int().optional().describe('Filter by user_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = checkAuth(args)
      if (!auth.ok) return authError(auth.error)
      try {
        const user = await getEffectiveUser(args.user_id)
        const sequences = await LearningSequence.query()
          .where('user_id', user.id)
          .orderBy('updated_at', 'desc')
          .limit(args.limit)
        return okResult({
          count: sequences.length,
          learning_sequences: sequences.map((s) => s.toJSON()),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_iktp_indicators',
    {
      description: 'List IKTP indicators (Indikator Ketercapaian Tujuan Pembelajaran).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        learning_objective_id: z.number().int().optional().describe('Filter by TP ID'),
        sequence_id: z.number().int().optional().describe('Filter by sequence ID'),
        limit: z.number().int().min(1).max(200).default(100).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = checkAuth(args)
      if (!auth.ok) return authError(auth.error)
      try {
        const query = IktpIndicator.query().preload('learningObjective')
        if (args.learning_objective_id)
          query.where('learning_objective_id', args.learning_objective_id)
        const indicators = await query.orderBy('id', 'asc').limit(args.limit)
        return okResult({
          count: indicators.length,
          iktp_indicators: indicators.map((i) => i.toJSON()),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_seed_curriculum_presets',
    {
      description: 'Seed or refresh PAUD curriculum presets (CP, TP, IKTP) into database (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
      }),
    },
    async (args) => {
      const auth = checkAuth(args)
      if (!auth.ok) return authError(auth.error)
      try {
        let cpCount = 0
        let tpCount = 0
        let iktpCount = 0

        for (const presetCp of PAUD_CURRICULUM_PRESETS.cps) {
          const cp = await CurriculumCp.updateOrCreate(
            { code: presetCp.code },
            {
              code: presetCp.code,
              element: presetCp.element,
              title: presetCp.title,
              description: presetCp.description,
              phase: 'Fondasi',
              curriculumVersion: 'Kurikulum Merdeka',
              isOfficial: true,
            }
          )
          cpCount++

          for (const presetObjective of presetCp.objectives) {
            const tp = await LearningObjective.updateOrCreate(
              { cpId: cp.id, code: presetObjective.code },
              {
                cpId: cp.id,
                code: presetObjective.code,
                title: presetObjective.title,
                groupContext: presetObjective.groupContext ?? null,
                source: 'library',
              }
            )
            tpCount++

            for (const presetIndicator of presetObjective.indicators) {
              await IktpIndicator.updateOrCreate(
                { learningObjectiveId: tp.id, description: presetIndicator.description },
                {
                  learningObjectiveId: tp.id,
                  description: presetIndicator.description,
                  evidenceType: presetIndicator.evidenceType,
                  achievementCriteria: presetIndicator.achievementCriteria,
                }
              )
              iktpCount++
            }
          }
        }

        return okResult({
          message: 'PAUD curriculum presets seeded successfully',
          cps_seeded: cpCount,
          tps_seeded: tpCount,
          iktp_indicators_seeded: iktpCount,
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )
}
