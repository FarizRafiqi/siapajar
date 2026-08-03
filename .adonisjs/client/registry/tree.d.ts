/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  comingSoon: typeof routes['coming-soon']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  auth: {
    google: {
      redirect: typeof routes['auth.google.redirect']
      callback: typeof routes['auth.google.callback']
    }
  }
  onboarding: {
    index: typeof routes['onboarding.index']
    store: typeof routes['onboarding.store']
  }
  dashboard: typeof routes['dashboard']
  classes: {
    index: typeof routes['classes.index']
    store: typeof routes['classes.store']
    show: typeof routes['classes.show']
    update: typeof routes['classes.update']
    destroy: typeof routes['classes.destroy']
    addStudent: typeof routes['classes.addStudent']
    importStudents: typeof routes['classes.importStudents']
    updateStudent: typeof routes['classes.updateStudent']
    removeStudent: typeof routes['classes.removeStudent']
  }
  teachingModules: {
    index: typeof routes['teaching-modules.index']
    store: typeof routes['teaching-modules.store']
    show: typeof routes['teaching-modules.show']
    update: typeof routes['teaching-modules.update']
    destroy: typeof routes['teaching-modules.destroy']
    generate: typeof routes['teaching-modules.generate']
    export: typeof routes['teaching-modules.export']
    exportPdf: typeof routes['teaching-modules.exportPdf']
  }
  exams: {
    index: typeof routes['exams.index']
    store: typeof routes['exams.store']
    show: typeof routes['exams.show']
    update: typeof routes['exams.update']
    destroy: typeof routes['exams.destroy']
    generate: typeof routes['exams.generate']
    export: typeof routes['exams.export']
    exportPdf: typeof routes['exams.exportPdf']
  }
  annualPlans: {
    index: typeof routes['annual-plans.index']
    store: typeof routes['annual-plans.store']
    show: typeof routes['annual-plans.show']
    update: typeof routes['annual-plans.update']
    destroy: typeof routes['annual-plans.destroy']
    generate: typeof routes['annual-plans.generate']
    export: typeof routes['annual-plans.export']
    exportPdf: typeof routes['annual-plans.exportPdf']
  }
  semesterPlans: {
    index: typeof routes['semester-plans.index']
    store: typeof routes['semester-plans.store']
    show: typeof routes['semester-plans.show']
    update: typeof routes['semester-plans.update']
    destroy: typeof routes['semester-plans.destroy']
    generate: typeof routes['semester-plans.generate']
    export: typeof routes['semester-plans.export']
    exportPdf: typeof routes['semester-plans.exportPdf']
  }
  rppm: {
    index: typeof routes['rppm.index']
    show: typeof routes['rppm.show']
    update: typeof routes['rppm.update']
    destroy: typeof routes['rppm.destroy']
    generate: typeof routes['rppm.generate']
  }
  rpph: {
    index: typeof routes['rpph.index']
    show: typeof routes['rpph.show']
    update: typeof routes['rpph.update']
    destroy: typeof routes['rpph.destroy']
    generate: typeof routes['rpph.generate']
  }
  lkpd: {
    index: typeof routes['lkpd.index']
    show: typeof routes['lkpd.show']
    destroy: typeof routes['lkpd.destroy']
    generate: typeof routes['lkpd.generate']
  }
  mediaModules: {
    index: typeof routes['media-modules.index']
    show: typeof routes['media-modules.show']
    destroy: typeof routes['media-modules.destroy']
    generate: typeof routes['media-modules.generate']
  }
  paudAssessments: {
    index: typeof routes['paud-assessments.index']
    store: typeof routes['paud-assessments.store']
    update: typeof routes['paud-assessments.update']
    destroy: typeof routes['paud-assessments.destroy']
  }
  assessments: {
    index: typeof routes['assessments.index']
    store: typeof routes['assessments.store']
    show: typeof routes['assessments.show']
    updateScores: typeof routes['assessments.updateScores']
    destroy: typeof routes['assessments.destroy']
    export: typeof routes['assessments.export']
  }
  principal: {
    index: typeof routes['principal.index']
    teacher: typeof routes['principal.teacher']
  }
  reportCards: {
    index: typeof routes['report-cards.index']
    show: typeof routes['report-cards.show']
    exportPdf: typeof routes['report-cards.exportPdf']
  }
  subjects: {
    index: typeof routes['subjects.index']
    store: typeof routes['subjects.store']
    storeDefaults: typeof routes['subjects.storeDefaults']
    update: typeof routes['subjects.update']
    destroy: typeof routes['subjects.destroy']
  }
  settings: {
    index: typeof routes['settings.index']
    update: typeof routes['settings.update']
  }
  admin: {
    users: {
      index: typeof routes['admin.users.index']
      update: typeof routes['admin.users.update']
      destroy: typeof routes['admin.users.destroy']
    }
    packages: {
      index: typeof routes['admin.packages.index']
      store: typeof routes['admin.packages.store']
      update: typeof routes['admin.packages.update']
      destroy: typeof routes['admin.packages.destroy']
    }
    academicYears: {
      index: typeof routes['admin.academic-years.index']
      store: typeof routes['admin.academic-years.store']
      update: typeof routes['admin.academic-years.update']
      destroy: typeof routes['admin.academic-years.destroy']
    }
    schools: {
      index: typeof routes['admin.schools.index']
      store: typeof routes['admin.schools.store']
      update: typeof routes['admin.schools.update']
      destroy: typeof routes['admin.schools.destroy']
    }
    aiSettings: {
      index: typeof routes['admin.ai-settings.index']
      update: typeof routes['admin.ai-settings.update']
      test: typeof routes['admin.ai-settings.test']
      models: typeof routes['admin.ai-settings.models']
    }
  }
}
