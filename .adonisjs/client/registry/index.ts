/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'onboarding.index': {
    methods: ["GET","HEAD"],
    pattern: '/onboarding',
    tokens: [{"old":"/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['onboarding.index']['types'],
  },
  'onboarding.store': {
    methods: ["POST"],
    pattern: '/onboarding',
    tokens: [{"old":"/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['onboarding.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'classes.index': {
    methods: ["GET","HEAD"],
    pattern: '/classes',
    tokens: [{"old":"/classes","type":0,"val":"classes","end":""}],
    types: placeholder as Registry['classes.index']['types'],
  },
  'classes.store': {
    methods: ["POST"],
    pattern: '/classes',
    tokens: [{"old":"/classes","type":0,"val":"classes","end":""}],
    types: placeholder as Registry['classes.store']['types'],
  },
  'classes.show': {
    methods: ["GET","HEAD"],
    pattern: '/classes/:id',
    tokens: [{"old":"/classes/:id","type":0,"val":"classes","end":""},{"old":"/classes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['classes.show']['types'],
  },
  'classes.update': {
    methods: ["PUT"],
    pattern: '/classes/:id',
    tokens: [{"old":"/classes/:id","type":0,"val":"classes","end":""},{"old":"/classes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['classes.update']['types'],
  },
  'classes.destroy': {
    methods: ["DELETE"],
    pattern: '/classes/:id',
    tokens: [{"old":"/classes/:id","type":0,"val":"classes","end":""},{"old":"/classes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['classes.destroy']['types'],
  },
  'classes.addStudent': {
    methods: ["POST"],
    pattern: '/classes/:id/students',
    tokens: [{"old":"/classes/:id/students","type":0,"val":"classes","end":""},{"old":"/classes/:id/students","type":1,"val":"id","end":""},{"old":"/classes/:id/students","type":0,"val":"students","end":""}],
    types: placeholder as Registry['classes.addStudent']['types'],
  },
  'classes.removeStudent': {
    methods: ["DELETE"],
    pattern: '/classes/:id/students/:studentId',
    tokens: [{"old":"/classes/:id/students/:studentId","type":0,"val":"classes","end":""},{"old":"/classes/:id/students/:studentId","type":1,"val":"id","end":""},{"old":"/classes/:id/students/:studentId","type":0,"val":"students","end":""},{"old":"/classes/:id/students/:studentId","type":1,"val":"studentId","end":""}],
    types: placeholder as Registry['classes.removeStudent']['types'],
  },
  'teaching-modules.index': {
    methods: ["GET","HEAD"],
    pattern: '/teaching-modules',
    tokens: [{"old":"/teaching-modules","type":0,"val":"teaching-modules","end":""}],
    types: placeholder as Registry['teaching-modules.index']['types'],
  },
  'teaching-modules.store': {
    methods: ["POST"],
    pattern: '/teaching-modules',
    tokens: [{"old":"/teaching-modules","type":0,"val":"teaching-modules","end":""}],
    types: placeholder as Registry['teaching-modules.store']['types'],
  },
  'teaching-modules.show': {
    methods: ["GET","HEAD"],
    pattern: '/teaching-modules/:id',
    tokens: [{"old":"/teaching-modules/:id","type":0,"val":"teaching-modules","end":""},{"old":"/teaching-modules/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teaching-modules.show']['types'],
  },
  'teaching-modules.update': {
    methods: ["PUT"],
    pattern: '/teaching-modules/:id',
    tokens: [{"old":"/teaching-modules/:id","type":0,"val":"teaching-modules","end":""},{"old":"/teaching-modules/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teaching-modules.update']['types'],
  },
  'teaching-modules.destroy': {
    methods: ["DELETE"],
    pattern: '/teaching-modules/:id',
    tokens: [{"old":"/teaching-modules/:id","type":0,"val":"teaching-modules","end":""},{"old":"/teaching-modules/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['teaching-modules.destroy']['types'],
  },
  'teaching-modules.generate': {
    methods: ["POST"],
    pattern: '/teaching-modules/generate',
    tokens: [{"old":"/teaching-modules/generate","type":0,"val":"teaching-modules","end":""},{"old":"/teaching-modules/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['teaching-modules.generate']['types'],
  },
  'exams.index': {
    methods: ["GET","HEAD"],
    pattern: '/exams',
    tokens: [{"old":"/exams","type":0,"val":"exams","end":""}],
    types: placeholder as Registry['exams.index']['types'],
  },
  'exams.store': {
    methods: ["POST"],
    pattern: '/exams',
    tokens: [{"old":"/exams","type":0,"val":"exams","end":""}],
    types: placeholder as Registry['exams.store']['types'],
  },
  'exams.show': {
    methods: ["GET","HEAD"],
    pattern: '/exams/:id',
    tokens: [{"old":"/exams/:id","type":0,"val":"exams","end":""},{"old":"/exams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exams.show']['types'],
  },
  'exams.update': {
    methods: ["PUT"],
    pattern: '/exams/:id',
    tokens: [{"old":"/exams/:id","type":0,"val":"exams","end":""},{"old":"/exams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exams.update']['types'],
  },
  'exams.destroy': {
    methods: ["DELETE"],
    pattern: '/exams/:id',
    tokens: [{"old":"/exams/:id","type":0,"val":"exams","end":""},{"old":"/exams/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exams.destroy']['types'],
  },
  'exams.generate': {
    methods: ["POST"],
    pattern: '/exams/generate',
    tokens: [{"old":"/exams/generate","type":0,"val":"exams","end":""},{"old":"/exams/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['exams.generate']['types'],
  },
  'annual-plans.index': {
    methods: ["GET","HEAD"],
    pattern: '/annual-plans',
    tokens: [{"old":"/annual-plans","type":0,"val":"annual-plans","end":""}],
    types: placeholder as Registry['annual-plans.index']['types'],
  },
  'annual-plans.store': {
    methods: ["POST"],
    pattern: '/annual-plans',
    tokens: [{"old":"/annual-plans","type":0,"val":"annual-plans","end":""}],
    types: placeholder as Registry['annual-plans.store']['types'],
  },
  'annual-plans.show': {
    methods: ["GET","HEAD"],
    pattern: '/annual-plans/:id',
    tokens: [{"old":"/annual-plans/:id","type":0,"val":"annual-plans","end":""},{"old":"/annual-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['annual-plans.show']['types'],
  },
  'annual-plans.update': {
    methods: ["PUT"],
    pattern: '/annual-plans/:id',
    tokens: [{"old":"/annual-plans/:id","type":0,"val":"annual-plans","end":""},{"old":"/annual-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['annual-plans.update']['types'],
  },
  'annual-plans.destroy': {
    methods: ["DELETE"],
    pattern: '/annual-plans/:id',
    tokens: [{"old":"/annual-plans/:id","type":0,"val":"annual-plans","end":""},{"old":"/annual-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['annual-plans.destroy']['types'],
  },
  'annual-plans.generate': {
    methods: ["POST"],
    pattern: '/annual-plans/generate',
    tokens: [{"old":"/annual-plans/generate","type":0,"val":"annual-plans","end":""},{"old":"/annual-plans/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['annual-plans.generate']['types'],
  },
  'semester-plans.index': {
    methods: ["GET","HEAD"],
    pattern: '/semester-plans',
    tokens: [{"old":"/semester-plans","type":0,"val":"semester-plans","end":""}],
    types: placeholder as Registry['semester-plans.index']['types'],
  },
  'semester-plans.store': {
    methods: ["POST"],
    pattern: '/semester-plans',
    tokens: [{"old":"/semester-plans","type":0,"val":"semester-plans","end":""}],
    types: placeholder as Registry['semester-plans.store']['types'],
  },
  'semester-plans.show': {
    methods: ["GET","HEAD"],
    pattern: '/semester-plans/:id',
    tokens: [{"old":"/semester-plans/:id","type":0,"val":"semester-plans","end":""},{"old":"/semester-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['semester-plans.show']['types'],
  },
  'semester-plans.update': {
    methods: ["PUT"],
    pattern: '/semester-plans/:id',
    tokens: [{"old":"/semester-plans/:id","type":0,"val":"semester-plans","end":""},{"old":"/semester-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['semester-plans.update']['types'],
  },
  'semester-plans.destroy': {
    methods: ["DELETE"],
    pattern: '/semester-plans/:id',
    tokens: [{"old":"/semester-plans/:id","type":0,"val":"semester-plans","end":""},{"old":"/semester-plans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['semester-plans.destroy']['types'],
  },
  'semester-plans.generate': {
    methods: ["POST"],
    pattern: '/semester-plans/generate',
    tokens: [{"old":"/semester-plans/generate","type":0,"val":"semester-plans","end":""},{"old":"/semester-plans/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['semester-plans.generate']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
  'settings.update': {
    methods: ["PUT"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.update']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
