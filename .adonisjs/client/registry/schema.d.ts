/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'api.auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'api.auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'api.auth.google.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/google/redirect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['redirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['redirect']>>>
    }
  }
  'api.auth.google.callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/google/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['callback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['callback']>>>
    }
  }
  'api.classes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['index']>>>
    }
  }
  'api.classes.students': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['getStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['getStudents']>>>
    }
  }
  'api.classes.agenda': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/classes/:id/today-agenda'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['getTodayAgenda']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['getTodayAgenda']>>>
    }
  }
  'api.attendances.quickSubmit': {
    methods: ["POST"]
    pattern: '/api/v1/attendances/quick-submit'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['quickSubmitAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['quickSubmitAttendance']>>>
    }
  }
  'api.assessments.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/assessments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['index']>>>
    }
  }
  'api.students.timeline': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/students/:id/timeline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['getStudentTimeline']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['getStudentTimeline']>>>
    }
  }
  'api.assessments.quickCapture': {
    methods: ["POST"]
    pattern: '/api/v1/assessments/quick-capture'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['quickCapture']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['quickCapture']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
    }
  }
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/health'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'privacy': {
    methods: ["GET","HEAD"]
    pattern: '/privacy'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'terms': {
    methods: ["GET","HEAD"]
    pattern: '/terms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'mcp.wellknown': {
    methods: ["GET","HEAD"]
    pattern: '/.well-known/mcp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mcp_controller').default['wellKnown']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mcp_controller').default['wellKnown']>>>
    }
  }
  'mcp.handle': {
    methods: ["HEAD","OPTIONS","GET","POST","PUT","PATCH","DELETE"]
    pattern: '/mcp'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/mcp_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/mcp_controller').default['handle']>>>
    }
  }
  'coming-soon': {
    methods: ["GET","HEAD"]
    pattern: '/coming-soon'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'auth.google.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/auth/google/redirect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['redirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['redirect']>>>
    }
  }
  'auth.google.callback': {
    methods: ["GET","HEAD"]
    pattern: '/auth/google/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['callback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/google_auth_controller').default['callback']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'onboarding.index': {
    methods: ["GET","HEAD"]
    pattern: '/onboarding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['index']>>>
    }
  }
  'onboarding.store': {
    methods: ["POST"]
    pattern: '/onboarding'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/onboarding').onboardingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/onboarding').onboardingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'account.package': {
    methods: ["GET","HEAD"]
    pattern: '/my-package'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['package']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['package']>>>
    }
  }
  'account.usage': {
    methods: ["GET","HEAD"]
    pattern: '/usage'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['usage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['usage']>>>
    }
  }
  'account.subscriptions': {
    methods: ["GET","HEAD"]
    pattern: '/subscriptions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['subscriptions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_billing_controller').default['subscriptions']>>>
    }
  }
  'glossary.index': {
    methods: ["GET","HEAD"]
    pattern: '/glossary'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'curriculum.index': {
    methods: ["GET","HEAD"]
    pattern: '/curriculum'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['index']>>>
    }
  }
  'curriculum.export': {
    methods: ["GET","HEAD"]
    pattern: '/curriculum/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['export']>>>
    }
  }
  'curriculum.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/curriculum/export/pdf'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['exportPdf']>>>
    }
  }
  'documents.autosave': {
    methods: ["POST"]
    pattern: '/documents/:type/:id/autosave'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { type: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['autosave']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['autosave']>>>
    }
  }
  'documents.status': {
    methods: ["POST"]
    pattern: '/documents/:type/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { type: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['status']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['status']>>>
    }
  }
  'documents.duplicate': {
    methods: ["POST"]
    pattern: '/documents/:type/:id/duplicate'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { type: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['duplicate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/document_workflows_controller').default['duplicate']>>>
    }
  }
  'curriculum.objectives.store': {
    methods: ["POST"]
    pattern: '/curriculum/objectives'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/curriculum').createObjectiveValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/curriculum').createObjectiveValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeObjective']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeObjective']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'curriculum.objectives.destroy': {
    methods: ["DELETE"]
    pattern: '/curriculum/objectives/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['destroyObjective']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['destroyObjective']>>>
    }
  }
  'curriculum.sequences.store': {
    methods: ["POST"]
    pattern: '/curriculum/sequences'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/curriculum').createSequenceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/curriculum').createSequenceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeSequence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeSequence']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'curriculum.sequences.update': {
    methods: ["PUT"]
    pattern: '/curriculum/sequences/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/curriculum').updateSequenceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/curriculum').updateSequenceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['updateSequence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['updateSequence']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'curriculum.sequences.destroy': {
    methods: ["DELETE"]
    pattern: '/curriculum/sequences/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['destroySequence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['destroySequence']>>>
    }
  }
  'curriculum.indicators.store': {
    methods: ["POST"]
    pattern: '/curriculum/indicators'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/curriculum').createIndicatorValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/curriculum').createIndicatorValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeIndicator']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['storeIndicator']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'curriculum.presets.seed': {
    methods: ["POST"]
    pattern: '/curriculum/seed-presets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['seedPresets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['seedPresets']>>>
    }
  }
  'curriculum.presets.reset': {
    methods: ["POST"]
    pattern: '/curriculum/reset-presets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['resetPresets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curriculum_controller').default['resetPresets']>>>
    }
  }
  'classes.index': {
    methods: ["GET","HEAD"]
    pattern: '/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['index']>>>
    }
  }
  'classes.store': {
    methods: ["POST"]
    pattern: '/classes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/class').createClassValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/class').createClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'classes.show': {
    methods: ["GET","HEAD"]
    pattern: '/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['show']>>>
    }
  }
  'classes.update': {
    methods: ["PUT"]
    pattern: '/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/class').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/class').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'classes.destroy': {
    methods: ["DELETE"]
    pattern: '/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['destroy']>>>
    }
  }
  'classes.addStudent': {
    methods: ["POST"]
    pattern: '/classes/:id/students'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/student').createStudentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/student').createStudentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['addStudent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['addStudent']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'classes.importStudents': {
    methods: ["POST"]
    pattern: '/classes/:id/students/import'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['importStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['importStudents']>>>
    }
  }
  'classes.updateStudent': {
    methods: ["PUT"]
    pattern: '/classes/:id/students/:studentId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/student').updateStudentValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; studentId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/student').updateStudentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['updateStudent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['updateStudent']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'classes.removeStudent': {
    methods: ["DELETE"]
    pattern: '/classes/:id/students/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['removeStudent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/classes_controller').default['removeStudent']>>>
    }
  }
  'teaching-modules.index': {
    methods: ["GET","HEAD"]
    pattern: '/teaching-modules'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['index']>>>
    }
  }
  'teaching-modules.store': {
    methods: ["POST"]
    pattern: '/teaching-modules'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teaching_module').createTeachingModuleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/teaching_module').createTeachingModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teaching-modules.show': {
    methods: ["GET","HEAD"]
    pattern: '/teaching-modules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['show']>>>
    }
  }
  'teaching-modules.update': {
    methods: ["PUT"]
    pattern: '/teaching-modules/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teaching_module').updateTeachingModuleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/teaching_module').updateTeachingModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teaching-modules.destroy': {
    methods: ["DELETE"]
    pattern: '/teaching-modules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['destroy']>>>
    }
  }
  'teaching-modules.generate': {
    methods: ["POST"]
    pattern: '/teaching-modules/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateTeachingModuleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateTeachingModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teaching-modules.export': {
    methods: ["GET","HEAD"]
    pattern: '/teaching-modules/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['export']>>>
    }
  }
  'teaching-modules.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/teaching-modules/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teaching_modules_controller').default['exportPdf']>>>
    }
  }
  'exams.index': {
    methods: ["GET","HEAD"]
    pattern: '/exams'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['index']>>>
    }
  }
  'exams.store': {
    methods: ["POST"]
    pattern: '/exams'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/exam').createExamValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/exam').createExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.generationStatus': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id/generation-status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['generationStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['generationStatus']>>>
    }
  }
  'exams.show': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['show']>>>
    }
  }
  'exams.uploadImage': {
    methods: ["POST"]
    pattern: '/exams/:id/upload-image'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['uploadImage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['uploadImage']>>>
    }
  }
  'exams.update': {
    methods: ["PUT"]
    pattern: '/exams/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/exam').updateExamValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/exam').updateExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.destroy': {
    methods: ["DELETE"]
    pattern: '/exams/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['destroy']>>>
    }
  }
  'exams.generate': {
    methods: ["POST"]
    pattern: '/exams/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateExamValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateExamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exams.export': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['export']>>>
    }
  }
  'exams.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['exportPdf']>>>
    }
  }
  'exams.printPreview': {
    methods: ["GET","HEAD"]
    pattern: '/exams/:id/print-preview'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['printPreview']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exams_controller').default['printPreview']>>>
    }
  }
  'annual-plans.index': {
    methods: ["GET","HEAD"]
    pattern: '/annual-plans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['index']>>>
    }
  }
  'annual-plans.store': {
    methods: ["POST"]
    pattern: '/annual-plans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/annual_plan').createAnnualPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/annual_plan').createAnnualPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'annual-plans.show': {
    methods: ["GET","HEAD"]
    pattern: '/annual-plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['show']>>>
    }
  }
  'annual-plans.update': {
    methods: ["PUT"]
    pattern: '/annual-plans/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/annual_plan').updateAnnualPlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/annual_plan').updateAnnualPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'annual-plans.destroy': {
    methods: ["DELETE"]
    pattern: '/annual-plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['destroy']>>>
    }
  }
  'annual-plans.generate': {
    methods: ["POST"]
    pattern: '/annual-plans/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateAnnualPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateAnnualPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'annual-plans.export': {
    methods: ["GET","HEAD"]
    pattern: '/annual-plans/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['export']>>>
    }
  }
  'annual-plans.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/annual-plans/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/annual_plans_controller').default['exportPdf']>>>
    }
  }
  'semester-plans.index': {
    methods: ["GET","HEAD"]
    pattern: '/semester-plans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['index']>>>
    }
  }
  'semester-plans.store': {
    methods: ["POST"]
    pattern: '/semester-plans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/semester_plan').createSemesterPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/semester_plan').createSemesterPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'semester-plans.show': {
    methods: ["GET","HEAD"]
    pattern: '/semester-plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['show']>>>
    }
  }
  'semester-plans.update': {
    methods: ["PUT"]
    pattern: '/semester-plans/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/semester_plan').updateSemesterPlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/semester_plan').updateSemesterPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'semester-plans.destroy': {
    methods: ["DELETE"]
    pattern: '/semester-plans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['destroy']>>>
    }
  }
  'semester-plans.generate': {
    methods: ["POST"]
    pattern: '/semester-plans/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateSemesterPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateSemesterPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'semester-plans.export': {
    methods: ["GET","HEAD"]
    pattern: '/semester-plans/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['export']>>>
    }
  }
  'semester-plans.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/semester-plans/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/semester_plans_controller').default['exportPdf']>>>
    }
  }
  'rppm.index': {
    methods: ["GET","HEAD"]
    pattern: '/rppm'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['index']>>>
    }
  }
  'rppm.show': {
    methods: ["GET","HEAD"]
    pattern: '/rppm/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['show']>>>
    }
  }
  'rppm.export': {
    methods: ["GET","HEAD"]
    pattern: '/rppm/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['export']>>>
    }
  }
  'rppm.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/rppm/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['exportPdf']>>>
    }
  }
  'rppm.update': {
    methods: ["PUT"]
    pattern: '/rppm/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/weekly_lesson_plan').updateWeeklyLessonPlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/weekly_lesson_plan').updateWeeklyLessonPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'rppm.destroy': {
    methods: ["DELETE"]
    pattern: '/rppm/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['destroy']>>>
    }
  }
  'rppm.generate': {
    methods: ["POST"]
    pattern: '/rppm/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateWeeklyLessonPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateWeeklyLessonPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/weekly_lesson_plans_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'rpph.index': {
    methods: ["GET","HEAD"]
    pattern: '/rpph'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['index']>>>
    }
  }
  'rpph.show': {
    methods: ["GET","HEAD"]
    pattern: '/rpph/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['show']>>>
    }
  }
  'rpph.export': {
    methods: ["GET","HEAD"]
    pattern: '/rpph/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['export']>>>
    }
  }
  'rpph.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/rpph/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['exportPdf']>>>
    }
  }
  'rpph.update': {
    methods: ["PUT"]
    pattern: '/rpph/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/daily_lesson_plan').updateDailyLessonPlanValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/daily_lesson_plan').updateDailyLessonPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'rpph.destroy': {
    methods: ["DELETE"]
    pattern: '/rpph/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['destroy']>>>
    }
  }
  'rpph.generate': {
    methods: ["POST"]
    pattern: '/rpph/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateDailyLessonPlanValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateDailyLessonPlanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/daily_lesson_plans_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lkpd.index': {
    methods: ["GET","HEAD"]
    pattern: '/lkpd'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['index']>>>
    }
  }
  'lkpd.show': {
    methods: ["GET","HEAD"]
    pattern: '/lkpd/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['show']>>>
    }
  }
  'lkpd.export': {
    methods: ["GET","HEAD"]
    pattern: '/lkpd/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['export']>>>
    }
  }
  'lkpd.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/lkpd/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['exportPdf']>>>
    }
  }
  'lkpd.destroy': {
    methods: ["DELETE"]
    pattern: '/lkpd/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['destroy']>>>
    }
  }
  'lkpd.generate': {
    methods: ["POST"]
    pattern: '/lkpd/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateLkpdValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateLkpdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lkpds_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'media-modules.index': {
    methods: ["GET","HEAD"]
    pattern: '/media-modules'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['index']>>>
    }
  }
  'media-modules.show': {
    methods: ["GET","HEAD"]
    pattern: '/media-modules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['show']>>>
    }
  }
  'media-modules.destroy': {
    methods: ["DELETE"]
    pattern: '/media-modules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['destroy']>>>
    }
  }
  'media-modules.generate': {
    methods: ["POST"]
    pattern: '/media-modules/generate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/generate').generateMediaModuleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/generate').generateMediaModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['generate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['generate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'media-modules.exportPptx': {
    methods: ["GET","HEAD"]
    pattern: '/media-modules/:id/export/pptx'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['exportPptx']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['exportPptx']>>>
    }
  }
  'media-modules.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/media-modules/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_modules_controller').default['exportPdf']>>>
    }
  }
  'paud-assessments.index': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['index']>>>
    }
  }
  'paud-assessments.store': {
    methods: ["POST"]
    pattern: '/paud-assessments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/paud_assessment').createPaudAssessmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/paud_assessment').createPaudAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'paud-assessments.generateAi': {
    methods: ["POST"]
    pattern: '/paud-assessments/generate-ai'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/paud_assessment').generateAiPaudAssessmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/paud_assessment').generateAiPaudAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['generateAi']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['generateAi']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'paud-assessments.exportBundle': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments/export-bundle'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/paud_assessment').exportBundlePaudAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportBundle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportBundle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'paud-assessments.exportBundlePdf': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments/export-bundle/pdf'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/paud_assessment').exportBundlePaudAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportBundlePdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportBundlePdf']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'paud-assessments.update': {
    methods: ["PUT"]
    pattern: '/paud-assessments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/paud_assessment').updatePaudAssessmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/paud_assessment').updatePaudAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'paud-assessments.destroy': {
    methods: ["DELETE"]
    pattern: '/paud-assessments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['destroy']>>>
    }
  }
  'paud-assessments.export': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['export']>>>
    }
  }
  'paud-assessments.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/paud_assessments_controller').default['exportPdf']>>>
    }
  }
  'paud-assessments.attachments.show': {
    methods: ["GET","HEAD"]
    pattern: '/paud-assessments/:id/attachments/:attachmentId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; attachmentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessment_attachments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessment_attachments_controller').default['show']>>>
    }
  }
  'assessments.index': {
    methods: ["GET","HEAD"]
    pattern: '/assessments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['index']>>>
    }
  }
  'assessments.store': {
    methods: ["POST"]
    pattern: '/assessments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/assessment').createAssessmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/assessment').createAssessmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'assessments.show': {
    methods: ["GET","HEAD"]
    pattern: '/assessments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['show']>>>
    }
  }
  'assessments.updateScores': {
    methods: ["PUT"]
    pattern: '/assessments/:id/scores'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/assessment').updateScoresValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/assessment').updateScoresValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['updateScores']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['updateScores']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'assessments.destroy': {
    methods: ["DELETE"]
    pattern: '/assessments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['destroy']>>>
    }
  }
  'assessments.export': {
    methods: ["GET","HEAD"]
    pattern: '/assessments/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['export']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['export']>>>
    }
  }
  'assessments.exportDocx': {
    methods: ["GET","HEAD"]
    pattern: '/assessments/:id/export/docx'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['exportDocx']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['exportDocx']>>>
    }
  }
  'assessments.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/assessments/:id/export/pdf'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['exportPdf']>>>
    }
  }
  'principal.index': {
    methods: ["GET","HEAD"]
    pattern: '/principal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/principal_dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/principal_dashboard_controller').default['index']>>>
    }
  }
  'principal.teacher': {
    methods: ["GET","HEAD"]
    pattern: '/principal/teachers/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/principal_dashboard_controller').default['teacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/principal_dashboard_controller').default['teacher']>>>
    }
  }
  'report-cards.index': {
    methods: ["GET","HEAD"]
    pattern: '/report-cards'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['index']>>>
    }
  }
  'report-cards.show': {
    methods: ["GET","HEAD"]
    pattern: '/report-cards/:classId/:semesterId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { classId: ParamValue; semesterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['show']>>>
    }
  }
  'report-cards.exportPdf': {
    methods: ["GET","HEAD"]
    pattern: '/report-cards/:classId/:semesterId/:studentId/export'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { classId: ParamValue; semesterId: ParamValue; studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['exportPdf']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['exportPdf']>>>
    }
  }
  'report-cards.exportDocx': {
    methods: ["GET","HEAD"]
    pattern: '/report-cards/:classId/:semesterId/:studentId/export/docx'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { classId: ParamValue; semesterId: ParamValue; studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['exportDocx']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['exportDocx']>>>
    }
  }
  'report-cards.narratives.save': {
    methods: ["POST"]
    pattern: '/report-cards/:classId/:semesterId/:studentId/narratives'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { classId: ParamValue; semesterId: ParamValue; studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['saveNarrative']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['saveNarrative']>>>
    }
  }
  'report-cards.narratives.generate': {
    methods: ["POST"]
    pattern: '/report-cards/:classId/:semesterId/narratives/generate'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { classId: ParamValue; semesterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['generateNarratives']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['generateNarratives']>>>
    }
  }
  'report-narratives.approve': {
    methods: ["POST"]
    pattern: '/report-narratives/:id/approve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['approveNarrative']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/report_cards_controller').default['approveNarrative']>>>
    }
  }
  'subjects.index': {
    methods: ["GET","HEAD"]
    pattern: '/subjects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['index']>>>
    }
  }
  'subjects.store': {
    methods: ["POST"]
    pattern: '/subjects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/subject').createSubjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/subject').createSubjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'subjects.storeDefaults': {
    methods: ["POST"]
    pattern: '/subjects/defaults'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['storeDefaults']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['storeDefaults']>>>
    }
  }
  'subjects.update': {
    methods: ["PUT"]
    pattern: '/subjects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/subject').updateSubjectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/subject').updateSubjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'subjects.destroy': {
    methods: ["DELETE"]
    pattern: '/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/subjects_controller').default['destroy']>>>
    }
  }
  'settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
    }
  }
  'settings.update': {
    methods: ["PUT"]
    pattern: '/settings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/settings').createAdminSettingsValidator)>|InferInput<(typeof import('#validators/settings').createSettingsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/settings').createAdminSettingsValidator)>|InferInput<(typeof import('#validators/settings').createSettingsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['index']>>>
    }
  }
  'admin.users.update': {
    methods: ["PUT"]
    pattern: '/admin/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updateUserRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updateUserRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['destroy']>>>
    }
  }
  'admin.packages.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/packages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['index']>>>
    }
  }
  'admin.packages.store': {
    methods: ["POST"]
    pattern: '/admin/packages'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').createPackageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').createPackageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.packages.update': {
    methods: ["PUT"]
    pattern: '/admin/packages/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updatePackageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updatePackageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.packages.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/packages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_packages_controller').default['destroy']>>>
    }
  }
  'admin.entitlements.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/entitlements'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_entitlements_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_entitlements_controller').default['index']>>>
    }
  }
  'admin.entitlements.update': {
    methods: ["PUT"]
    pattern: '/admin/entitlements/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_entitlements_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_entitlements_controller').default['update']>>>
    }
  }
  'admin.academic-years.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/academic-years'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['index']>>>
    }
  }
  'admin.academic-years.store': {
    methods: ["POST"]
    pattern: '/admin/academic-years'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').createAcademicYearValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').createAcademicYearValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.academic-years.update': {
    methods: ["PUT"]
    pattern: '/admin/academic-years/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updateAcademicYearValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updateAcademicYearValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.academic-years.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/academic-years/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_academic_years_controller').default['destroy']>>>
    }
  }
  'admin.schools.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['index']>>>
    }
  }
  'admin.schools.store': {
    methods: ["POST"]
    pattern: '/admin/schools'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').createSchoolValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').createSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.schools.update': {
    methods: ["PUT"]
    pattern: '/admin/schools/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updateSchoolValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updateSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.schools.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/schools/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_schools_controller').default['destroy']>>>
    }
  }
  'admin.ai-settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/ai-settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['index']>>>
    }
  }
  'admin.ai-settings.update': {
    methods: ["PUT"]
    pattern: '/admin/ai-settings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ai_setting').updateAiSettingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/ai_setting').updateAiSettingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.ai-settings.test': {
    methods: ["POST"]
    pattern: '/admin/ai-settings/test'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ai_setting').testConnectionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/ai_setting').testConnectionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['test']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['test']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.ai-settings.models': {
    methods: ["POST"]
    pattern: '/admin/ai-settings/models'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ai_setting').listModelsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/ai_setting').listModelsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['models']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['models']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.ai-settings.oauth.openai.start': {
    methods: ["GET","HEAD"]
    pattern: '/admin/ai-settings/oauth/openai/start'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['oauthStart']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['oauthStart']>>>
    }
  }
  'admin.ai-settings.oauth.gemini.start': {
    methods: ["GET","HEAD"]
    pattern: '/admin/ai-settings/oauth/gemini/start'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['geminiOauthStart']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['geminiOauthStart']>>>
    }
  }
  'admin.ai-settings.oauth.gemini.callback': {
    methods: ["GET","HEAD"]
    pattern: '/admin/ai-settings/oauth/gemini/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['geminiOauthCallback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ai_settings_controller').default['geminiOauthCallback']>>>
    }
  }
  'admin.curriculum-presets.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/curriculum-presets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['index']>>>
    }
  }
  'admin.curriculum-presets.store': {
    methods: ["POST"]
    pattern: '/admin/curriculum-presets'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_curriculum_preset').createCurriculumPresetValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_curriculum_preset').createCurriculumPresetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.curriculum-presets.update': {
    methods: ["PUT"]
    pattern: '/admin/curriculum-presets/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_curriculum_preset').updateCurriculumPresetValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_curriculum_preset').updateCurriculumPresetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.curriculum-presets.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/curriculum-presets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['destroy']>>>
    }
  }
  'admin.curriculum-presets.resetDefaults': {
    methods: ["POST"]
    pattern: '/admin/curriculum-presets/reset-defaults'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['resetDefaults']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_curriculum_presets_controller').default['resetDefaults']>>>
    }
  }
}
