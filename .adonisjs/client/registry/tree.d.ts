/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
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
    removeStudent: typeof routes['classes.removeStudent']
  }
  teachingModules: {
    index: typeof routes['teaching-modules.index']
    store: typeof routes['teaching-modules.store']
    show: typeof routes['teaching-modules.show']
    update: typeof routes['teaching-modules.update']
    destroy: typeof routes['teaching-modules.destroy']
    generate: typeof routes['teaching-modules.generate']
  }
  exams: {
    index: typeof routes['exams.index']
    store: typeof routes['exams.store']
    show: typeof routes['exams.show']
    update: typeof routes['exams.update']
    destroy: typeof routes['exams.destroy']
    generate: typeof routes['exams.generate']
  }
  annualPlans: {
    index: typeof routes['annual-plans.index']
    store: typeof routes['annual-plans.store']
    show: typeof routes['annual-plans.show']
    update: typeof routes['annual-plans.update']
    destroy: typeof routes['annual-plans.destroy']
    generate: typeof routes['annual-plans.generate']
  }
  semesterPlans: {
    index: typeof routes['semester-plans.index']
    store: typeof routes['semester-plans.store']
    show: typeof routes['semester-plans.show']
    update: typeof routes['semester-plans.update']
    destroy: typeof routes['semester-plans.destroy']
    generate: typeof routes['semester-plans.generate']
  }
  subjects: {
    index: typeof routes['subjects.index']
    store: typeof routes['subjects.store']
    update: typeof routes['subjects.update']
    destroy: typeof routes['subjects.destroy']
  }
  settings: {
    index: typeof routes['settings.index']
    update: typeof routes['settings.update']
  }
}
