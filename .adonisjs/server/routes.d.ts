import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.store': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.addStudent': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.removeStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.store': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.generate': { paramsTuple?: []; params?: {} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.generate': { paramsTuple?: []; params?: {} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.store': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.generate': { paramsTuple?: []; params?: {} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.store': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.generate': { paramsTuple?: []; params?: {} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'subjects.store': { paramsTuple?: []; params?: {} }
    'subjects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'settings.update': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'classes.store': { paramsTuple?: []; params?: {} }
    'classes.addStudent': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.store': { paramsTuple?: []; params?: {} }
    'teaching-modules.generate': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'exams.generate': { paramsTuple?: []; params?: {} }
    'annual-plans.store': { paramsTuple?: []; params?: {} }
    'annual-plans.generate': { paramsTuple?: []; params?: {} }
    'semester-plans.store': { paramsTuple?: []; params?: {} }
    'semester-plans.generate': { paramsTuple?: []; params?: {} }
    'subjects.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.removeStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'teaching-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}