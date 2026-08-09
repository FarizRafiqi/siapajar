import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { API_KEY_PARAM, checkAuthAndAuthorize, authError, okResult, errorResult } from '../auth.js'
import { applyUserOrSchoolScope } from '../scoping.js'
import School from '#models/school'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import Subject from '#models/subject'
import AcademicYear from '#models/academic_year'
import Semester from '#models/semester'
import User from '#models/user'
import Package from '#models/package'
import PackageEntitlement from '#models/package_entitlement'
import AiSetting from '#models/ai_setting'
import { test9routerConnection, listModels } from '#services/ai_service'
import env from '#start/env'

export function registerAdminTools(server: McpServer) {
  // -------------------------------------------------------------------------
  // Schools
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_schools',
    {
      description: 'List schools registered in SiapAjar.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows to return'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'kepala_sekolah'],
        group: 'schools',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = School.query()
        if (ctx.role === 'kepala_sekolah') {
          if (ctx.schoolId) {
            query.where('id', ctx.schoolId)
          } else {
            query.whereRaw('1 = 0')
          }
        }
        const schools = await query.orderBy('id', 'asc').limit(args.limit)
        return okResult({ count: schools.length, schools: schools.map((s) => s.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_school',
    {
      description: 'Get details of a school by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('School ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'kepala_sekolah'],
        group: 'schools',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      if (ctx.role === 'kepala_sekolah' && ctx.schoolId !== args.id) {
        return errorResult(`School with ID ${args.id} not found`)
      }

      try {
        const school = await School.query().where('id', args.id).preload('users').first()
        if (!school) return errorResult(`School with ID ${args.id} not found`)
        return okResult(school.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_school',
    {
      description: 'Create a new school (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        name: z.string().min(1).describe('School name'),
        npsn: z.string().optional().describe('NPSN identifier'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'schools',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const school = await School.create({
          name: args.name,
          npsn: args.npsn ?? null,
        })
        return okResult({ message: 'School created', school: school.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_school',
    {
      description: 'Update a school by ID (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('School ID'),
        name: z.string().optional().describe('School name'),
        npsn: z.string().optional().describe('NPSN identifier'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'schools',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const school = await School.find(args.id)
        if (!school) return errorResult(`School with ID ${args.id} not found`)
        if (args.name !== undefined) school.name = args.name
        if (args.npsn !== undefined) school.npsn = args.npsn
        await school.save()
        return okResult({ message: 'School updated', school: school.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // Classes
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_classes',
    {
      description: 'List classes with optional filters.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        user_id: z.number().int().optional().describe('Filter by teacher user_id (Admin only)'),
        academic_year_id: z.number().int().optional().describe('Filter by academic_year_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'classes',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SchoolClass.query().preload('academicYear').preload('user')
        applyUserOrSchoolScope(query, ctx)

        if (ctx.role === 'admin' && args.user_id) {
          query.where('user_id', args.user_id)
        }
        if (args.academic_year_id) {
          query.where('academic_year_id', args.academic_year_id)
        }

        const classes = await query.orderBy('name', 'asc').limit(args.limit)
        return okResult({ count: classes.length, classes: classes.map((c) => c.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_class',
    {
      description: 'Get class details including students and academic year.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Class ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'classes',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = SchoolClass.query()
          .where('id', args.id)
          .preload('academicYear')
          .preload('user')
          .preload('students')

        applyUserOrSchoolScope(query, ctx)
        const schoolClass = await query.first()

        if (!schoolClass) return errorResult(`Class with ID ${args.id} not found`)
        return okResult(schoolClass.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_class',
    {
      description: 'Create a new class.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().describe('Academic year ID'),
        name: z.string().min(1).describe('Class name (e.g. Kelompok A)'),
        grade_level: z.number().int().optional().default(1).describe('Grade level number'),
        group_context: z.enum(['a', 'b']).optional().describe('PAUD group context (a or b)'),
        user_id: z.number().int().optional().describe('Teacher user_id (Admin only)'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'classes',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const targetUserId = ctx.role === 'admin' && args.user_id ? args.user_id : ctx.user.id
        const schoolClass = await SchoolClass.create({
          userId: targetUserId,
          academicYearId: args.academic_year_id,
          name: args.name,
          gradeLevel: args.grade_level ?? 1,
          groupContext: args.group_context ?? null,
        })
        return okResult({ message: 'Class created', class: schoolClass.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_class',
    {
      description: 'Update class details.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Class ID'),
        name: z.string().optional().describe('Class name'),
        grade_level: z.number().int().optional().describe('Grade level'),
        group_context: z.enum(['a', 'b']).optional().describe('PAUD group context'),
        academic_year_id: z.number().int().optional().describe('Academic year ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'classes',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const schoolClass = await SchoolClass.find(args.id)
        if (!schoolClass) return errorResult(`Class with ID ${args.id} not found`)

        if (ctx.role === 'guru' && schoolClass.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own classes.')
        }

        if (args.name !== undefined) schoolClass.name = args.name
        if (args.grade_level !== undefined) schoolClass.gradeLevel = args.grade_level
        if (args.group_context !== undefined) schoolClass.groupContext = args.group_context
        if (args.academic_year_id !== undefined) schoolClass.academicYearId = args.academic_year_id
        await schoolClass.save()
        return okResult({ message: 'Class updated', class: schoolClass.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_class',
    {
      description: 'Delete a class by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Class ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'classes',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const schoolClass = await SchoolClass.find(args.id)
        if (!schoolClass) return errorResult(`Class with ID ${args.id} not found`)

        if (ctx.role === 'guru' && schoolClass.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await schoolClass.delete()
        return okResult({ message: `Class ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // Students
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_students',
    {
      description: 'List students with optional class_id or search filters.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().optional().describe('Filter by class_id'),
        search: z.string().optional().describe('Search by student name or NIS'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'students',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Student.query().preload('schoolClass')
        if (ctx.role === 'guru') {
          query.whereHas('schoolClass', (cQ) => cQ.where('user_id', ctx.user.id))
        } else if (ctx.role === 'kepala_sekolah') {
          if (ctx.schoolId) {
            query.whereHas('schoolClass', (cQ) =>
              cQ.whereHas('user', (uQ) => uQ.where('school_id', ctx.schoolId!))
            )
          } else {
            query.whereRaw('1 = 0')
          }
        }

        if (args.class_id) query.where('class_id', args.class_id)
        if (args.search) {
          query.where((q) => {
            q.whereILike('full_name', `%${args.search}%`).orWhereILike('nis', `%${args.search}%`)
          })
        }
        const students = await query.orderBy('full_name', 'asc').limit(args.limit)
        return okResult({ count: students.length, students: students.map((s) => s.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_student',
    {
      description: 'Get student details by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Student ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'students',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Student.query().where('id', args.id).preload('schoolClass')
        if (ctx.role === 'guru') {
          query.whereHas('schoolClass', (cQ) => cQ.where('user_id', ctx.user.id))
        } else if (ctx.role === 'kepala_sekolah') {
          if (ctx.schoolId) {
            query.whereHas('schoolClass', (cQ) =>
              cQ.whereHas('user', (uQ) => uQ.where('school_id', ctx.schoolId!))
            )
          } else {
            query.whereRaw('1 = 0')
          }
        }

        const student = await query.first()
        if (!student) return errorResult(`Student with ID ${args.id} not found`)
        return okResult(student.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_student',
    {
      description: 'Create a student in a class.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        class_id: z.number().int().describe('Class ID'),
        name: z.string().min(1).describe('Student full name'),
        nis: z.string().optional().describe('Student NIS number'),
        nisn: z.string().optional().describe('Student NISN number'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'students',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const schoolClass = await SchoolClass.find(args.class_id)
        if (!schoolClass) return errorResult(`Class with ID ${args.class_id} not found`)

        if (ctx.role === 'guru' && schoolClass.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only add students to your own classes.')
        }

        const student = await Student.create({
          classId: args.class_id,
          fullName: args.name,
          nis: args.nis ?? '',
          nisn: args.nisn ?? null,
        })
        return okResult({ message: 'Student created', student: student.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_student',
    {
      description: 'Update student details.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Student ID'),
        name: z.string().optional().describe('Full name'),
        nis: z.string().optional().describe('NIS'),
        nisn: z.string().optional().describe('NISN'),
        class_id: z.number().int().optional().describe('Class ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'students',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const student = await Student.query().where('id', args.id).preload('schoolClass').first()
        if (!student) return errorResult(`Student with ID ${args.id} not found`)

        if (ctx.role === 'guru' && student.schoolClass.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update students in your own classes.')
        }

        if (args.name !== undefined) student.fullName = args.name
        if (args.nis !== undefined) student.nis = args.nis
        if (args.nisn !== undefined) student.nisn = args.nisn
        if (args.class_id !== undefined) student.classId = args.class_id
        await student.save()
        return okResult({ message: 'Student updated', student: student.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_student',
    {
      description: 'Delete a student.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Student ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'students',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const student = await Student.query().where('id', args.id).preload('schoolClass').first()
        if (!student) return errorResult(`Student with ID ${args.id} not found`)

        if (ctx.role === 'guru' && student.schoolClass.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await student.delete()
        return okResult({ message: `Student ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // Subjects
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_subjects',
    {
      description: 'List subjects.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        user_id: z.number().int().optional().describe('Teacher user_id (Admin only)'),
        education_level: z.enum(['tk', 'sd']).optional().describe('Education level'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru', 'kepala_sekolah'],
        group: 'subjects',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const query = Subject.query()
        applyUserOrSchoolScope(query, ctx)

        if (ctx.role === 'admin' && args.user_id) {
          query.where('user_id', args.user_id)
        }
        if (args.education_level) {
          query.where('education_level', args.education_level)
        }

        const subjects = await query.orderBy('name', 'asc').limit(args.limit)
        return okResult({ count: subjects.length, subjects: subjects.map((s) => s.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_subject',
    {
      description: 'Create a new subject.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        name: z.string().min(1).describe('Subject name'),
        education_level: z.enum(['tk', 'sd']).optional().default('tk').describe('Education level'),
        grade_level: z.number().int().optional().describe('Grade level'),
        is_active: z.boolean().optional().default(true).describe('Active status'),
        user_id: z.number().int().optional().describe('Owner user_id (Admin only)'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'subjects',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const targetUserId = ctx.role === 'admin' && args.user_id ? args.user_id : ctx.user.id
        const subject = await Subject.create({
          userId: targetUserId,
          name: args.name,
          educationLevel: args.education_level ?? 'tk',
          gradeLevel: args.grade_level ?? null,
          isActive: args.is_active ?? true,
        })
        return okResult({ message: 'Subject created', subject: subject.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_subject',
    {
      description: 'Update subject details.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Subject ID'),
        name: z.string().optional().describe('Subject name'),
        education_level: z.enum(['tk', 'sd']).optional().describe('Education level'),
        grade_level: z.number().int().optional().describe('Grade level'),
        is_active: z.boolean().optional().describe('Active status'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'subjects',
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const subject = await Subject.find(args.id)
        if (!subject) return errorResult(`Subject with ID ${args.id} not found`)

        if (ctx.role === 'guru' && subject.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only update your own subjects.')
        }

        if (args.name !== undefined) subject.name = args.name
        if (args.education_level !== undefined) subject.educationLevel = args.education_level
        if (args.grade_level !== undefined) subject.gradeLevel = args.grade_level
        if (args.is_active !== undefined) subject.isActive = args.is_active
        await subject.save()
        return okResult({ message: 'Subject updated', subject: subject.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_delete_subject',
    {
      description: 'Delete a subject by ID.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Subject ID'),
        confirm: z.boolean().default(false).describe('Set to true to confirm deletion'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin', 'guru'],
        group: 'subjects',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)
      const { ctx } = auth

      try {
        const subject = await Subject.find(args.id)
        if (!subject) return errorResult(`Subject with ID ${args.id} not found`)

        if (ctx.role === 'guru' && subject.userId !== ctx.user.id) {
          return errorResult('Forbidden: You can only delete resources owned by your account.')
        }

        await subject.delete()
        return okResult({ message: `Subject ID ${args.id} deleted successfully.` })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // Academic Years & Semesters (Admin-only)
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_academic_years',
    {
      description: 'List academic years (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'academic_years',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const years = await AcademicYear.query()
          .preload('semesters')
          .orderBy('id', 'desc')
          .limit(args.limit)
        return okResult({ count: years.length, academic_years: years.map((y) => y.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_academic_year',
    {
      description: 'Create an academic year (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        name: z.string().min(1).describe('Academic year name (e.g. 2025/2026)'),
        is_active: z.boolean().optional().default(false).describe('Whether active'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'academic_years',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        if (args.is_active) {
          await AcademicYear.query().update({ isActive: false })
        }
        const year = await AcademicYear.create({
          name: args.name,
          isActive: args.is_active ?? false,
        })
        return okResult({ message: 'Academic year created', academic_year: year.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_academic_year',
    {
      description: 'Update academic year status or name (Admin). Requres confirm: true.',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Academic year ID'),
        name: z.string().optional().describe('Name'),
        is_active: z.boolean().optional().describe('Active status'),
        confirm: z.boolean().default(false).describe('Set to true to confirm update'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'academic_years',
        destructive: true,
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const year = await AcademicYear.find(args.id)
        if (!year) return errorResult(`Academic year ID ${args.id} not found`)
        if (args.is_active) {
          await AcademicYear.query().update({ isActive: false })
        }
        if (args.name !== undefined) year.name = args.name
        if (args.is_active !== undefined) year.isActive = args.is_active
        await year.save()
        return okResult({ message: 'Academic year updated', academic_year: year.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_semesters',
    {
      description: 'List semesters with optional academic_year_id filter (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().optional().describe('Filter by academic year ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'semesters',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const query = Semester.query().preload('academicYear')
        if (args.academic_year_id) query.where('academic_year_id', args.academic_year_id)
        const semesters = await query.orderBy('id', 'asc')
        return okResult({ count: semesters.length, semesters: semesters.map((s) => s.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_create_semester',
    {
      description: 'Create a semester for an academic year (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        academic_year_id: z.number().int().describe('Academic year ID'),
        name: z.string().min(1).describe('Semester name (e.g. Ganjil / Genap)'),
        is_active: z.boolean().optional().default(false).describe('Active status'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'semesters',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const semester = await Semester.create({
          academicYearId: args.academic_year_id,
          name: args.name,
          isActive: args.is_active ?? false,
        })
        return okResult({ message: 'Semester created', semester: semester.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_update_semester',
    {
      description: 'Update a semester (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Semester ID'),
        name: z.string().optional().describe('Semester name'),
        is_active: z.boolean().optional().describe('Active status'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'semesters',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const semester = await Semester.find(args.id)
        if (!semester) return errorResult(`Semester ID ${args.id} not found`)
        if (args.name !== undefined) semester.name = args.name
        if (args.is_active !== undefined) semester.isActive = args.is_active
        await semester.save()
        return okResult({ message: 'Semester updated', semester: semester.toJSON() })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // Users, Packages, Entitlements (Admin-only)
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_list_users',
    {
      description: 'List user accounts (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        role: z.string().optional().describe('Filter by role (admin, guru, kepala_sekolah)'),
        school_id: z.number().int().optional().describe('Filter by school_id'),
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const query = User.query().preload('school').preload('package')
        if (args.role) query.where('role', args.role)
        if (args.school_id) query.where('school_id', args.school_id)
        const users = await query.orderBy('id', 'asc').limit(args.limit)
        return okResult({ count: users.length, users: users.map((u) => u.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_packages',
    {
      description: 'List subscription packages and features (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        limit: z.number().int().min(1).max(200).default(50).describe('Max rows'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const packages = await Package.query()
          .preload('entitlements')
          .orderBy('sort_order', 'asc')
          .limit(args.limit)
        return okResult({ count: packages.length, packages: packages.map((p) => p.toJSON()) })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_get_package',
    {
      description: 'Get package details by ID (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        id: z.number().int().describe('Package ID'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const pkg = await Package.query().where('id', args.id).preload('entitlements').first()
        if (!pkg) return errorResult(`Package ID ${args.id} not found`)
        return okResult(pkg.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_list_entitlements',
    {
      description: 'List package entitlements (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
        package_id: z.number().int().optional().describe('Filter by package_id'),
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const query = PackageEntitlement.query().preload('package')
        if (args.package_id) query.where('package_id', args.package_id)
        const entitlements = await query.orderBy('id', 'asc')
        return okResult({
          count: entitlements.length,
          entitlements: entitlements.map((e) => e.toJSON()),
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  // -------------------------------------------------------------------------
  // AI Settings & Connection Test (Admin-only)
  // -------------------------------------------------------------------------
  server.registerTool(
    'siapajar_get_ai_settings',
    {
      description: 'Get current AI settings and model configurations (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const setting = await AiSetting.current()
        return okResult(setting.toJSON())
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )

  server.registerTool(
    'siapajar_test_ai_connection',
    {
      description: 'Test AI service connection and fetch available models (Admin).',
      inputSchema: z.object({
        ...API_KEY_PARAM,
      }),
    },
    async (args) => {
      const auth = await checkAuthAndAuthorize(args, {
        roles: ['admin'],
        group: 'admin',
      })
      if (!auth.ok) return authError(auth.error)

      try {
        const setting = await AiSetting.current()
        const apiKey = setting.apiKey || env.get('ROUTER_API_KEY') || ''
        const model = setting.model || 'gpt-4o-mini'

        let connectionOk = false
        let models: string[] = []

        if (setting.provider === '9router') {
          try {
            await test9routerConnection(model, apiKey)
            connectionOk = true
          } catch {
            connectionOk = false
          }
        } else {
          connectionOk = true
        }

        try {
          models = await listModels(setting.provider, apiKey)
        } catch {
          models = []
        }

        return okResult({
          provider: setting.provider,
          authMode: setting.authMode,
          connectionOk,
          model,
          availableModels: models,
        })
      } catch (err) {
        return errorResult(err instanceof Error ? err.message : String(err))
      }
    }
  )
}
