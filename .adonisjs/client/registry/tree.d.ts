/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  api: {
    auth: {
      login: typeof routes['api.auth.login']
      logout: typeof routes['api.auth.logout']
      google: {
        redirect: typeof routes['api.auth.google.redirect']
        callback: typeof routes['api.auth.google.callback']
      }
    }
    classes: {
      index: typeof routes['api.classes.index']
      students: typeof routes['api.classes.students']
      agenda: typeof routes['api.classes.agenda']
    }
    attendances: {
      quickSubmit: typeof routes['api.attendances.quickSubmit']
    }
    assessments: {
      index: typeof routes['api.assessments.index']
      quickCapture: typeof routes['api.assessments.quickCapture']
    }
    students: {
      timeline: typeof routes['api.students.timeline']
    }
    mayar: {
      webhook: typeof routes['api.mayar.webhook']
      checkout: typeof routes['api.mayar.checkout']
      status: typeof routes['api.mayar.status']
    }
    packages: {
      index: typeof routes['api.packages.index']
    }
    express: {
      katrol: {
        generate: typeof routes['api.express.katrol.generate']
      }
      jurnal: {
        generate: typeof routes['api.express.jurnal.generate']
      }
      kokurikuler: {
        generate: typeof routes['api.express.kokurikuler.generate']
      }
    }
  }
  home: typeof routes['home']
  health: typeof routes['health']
  privacy: typeof routes['privacy']
  terms: typeof routes['terms']
  mcp: {
    wellknown: typeof routes['mcp.wellknown']
    handle: typeof routes['mcp.handle']
  }
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
  emailVerification: {
    pending: typeof routes['email_verification.pending']
    resend: typeof routes['email_verification.resend']
    verify: typeof routes['email_verification.verify']
  }
  account: {
    emailChange: typeof routes['account.email_change']
    package: typeof routes['account.package']
    usage: typeof routes['account.usage']
    subscriptions: typeof routes['account.subscriptions']
  }
  freeBenefit: {
    claim: typeof routes['free_benefit.claim'] & {
      page: typeof routes['free_benefit.claim.page']
    }
  }
  onboarding: {
    index: typeof routes['onboarding.index']
    store: typeof routes['onboarding.store']
  }
  dashboard: typeof routes['dashboard']
  panel: {
    index: typeof routes['panel.index']
    dashboard: typeof routes['panel.dashboard']
    curriculum: {
      index: typeof routes['panel.curriculum.index']
    }
    classes: {
      index: typeof routes['panel.classes.index']
    }
    subjects: {
      index: typeof routes['panel.subjects.index']
    }
    glossary: {
      index: typeof routes['panel.glossary.index']
    }
    teachingModules: {
      index: typeof routes['panel.teaching-modules.index']
    }
    annualPlans: {
      index: typeof routes['panel.annual-plans.index']
    }
    semesterPlans: {
      index: typeof routes['panel.semester-plans.index']
    }
    rppm: {
      index: typeof routes['panel.rppm.index']
    }
    rpph: {
      index: typeof routes['panel.rpph.index']
    }
    lkpd: {
      index: typeof routes['panel.lkpd.index']
    }
    mediaModules: {
      index: typeof routes['panel.media-modules.index']
    }
    exams: {
      index: typeof routes['panel.exams.index']
    }
    assessments: {
      index: typeof routes['panel.assessments.index']
    }
    paudAssessments: {
      index: typeof routes['panel.paud-assessments.index']
    }
    reportCards: {
      index: typeof routes['panel.report-cards.index']
    }
    jurnal: {
      index: typeof routes['panel.jurnal.index']
    }
    kokurikuler: {
      index: typeof routes['panel.kokurikuler.index']
    }
    katrol: {
      index: typeof routes['panel.katrol.index']
    }
    account: {
      package: typeof routes['panel.account.package']
    }
    settings: {
      index: typeof routes['panel.settings.index']
    }
    legacy: {
      kurikulum: typeof routes['panel.legacy.kurikulum']
      kelas: typeof routes['panel.legacy.kelas']
      siswa: typeof routes['panel.legacy.siswa']
      asesmenPaud: typeof routes['panel.legacy.asesmen-paud']
      rapor: typeof routes['panel.legacy.rapor']
    }
  }
  billing: {
    index: typeof routes['billing.index']
  }
  express: {
    modulAjar: typeof routes['express.modulAjar']
    soal: typeof routes['express.soal']
    protaPromes: typeof routes['express.protaPromes']
    rapor: typeof routes['express.rapor']
    katrol: typeof routes['express.katrol']
    jurnal: typeof routes['express.jurnal']
    kokurikuler: typeof routes['express.kokurikuler']
  }
  lkpd: {
    index: typeof routes['lkpd.index']
    show: typeof routes['lkpd.show']
    export: typeof routes['lkpd.export']
    exportPdf: typeof routes['lkpd.exportPdf']
    destroy: typeof routes['lkpd.destroy']
    generate: typeof routes['lkpd.generate']
  }
  glossary: {
    index: typeof routes['glossary.index']
  }
  curriculum: {
    index: typeof routes['curriculum.index']
    print: typeof routes['curriculum.print']
    export: typeof routes['curriculum.export']
    exportPdf: typeof routes['curriculum.exportPdf']
    objectives: {
      store: typeof routes['curriculum.objectives.store']
      destroy: typeof routes['curriculum.objectives.destroy']
    }
    sequences: {
      store: typeof routes['curriculum.sequences.store']
      update: typeof routes['curriculum.sequences.update']
      destroy: typeof routes['curriculum.sequences.destroy']
    }
    indicators: {
      store: typeof routes['curriculum.indicators.store']
    }
    presets: {
      seed: typeof routes['curriculum.presets.seed']
      reset: typeof routes['curriculum.presets.reset']
    }
  }
  documents: {
    autosave: typeof routes['documents.autosave']
    status: typeof routes['documents.status']
    duplicate: typeof routes['documents.duplicate']
  }
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
    generationStatus: typeof routes['exams.generationStatus']
    show: typeof routes['exams.show']
    uploadImage: typeof routes['exams.uploadImage']
    update: typeof routes['exams.update']
    destroy: typeof routes['exams.destroy']
    generate: typeof routes['exams.generate']
    export: typeof routes['exams.export']
    exportPdf: typeof routes['exams.exportPdf']
    printPreview: typeof routes['exams.printPreview']
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
    export: typeof routes['rppm.export']
    exportPdf: typeof routes['rppm.exportPdf']
    update: typeof routes['rppm.update']
    destroy: typeof routes['rppm.destroy']
    generate: typeof routes['rppm.generate']
  }
  rpph: {
    index: typeof routes['rpph.index']
    show: typeof routes['rpph.show']
    export: typeof routes['rpph.export']
    exportPdf: typeof routes['rpph.exportPdf']
    update: typeof routes['rpph.update']
    destroy: typeof routes['rpph.destroy']
    generate: typeof routes['rpph.generate']
  }
  mediaModules: {
    index: typeof routes['media-modules.index']
    show: typeof routes['media-modules.show']
    destroy: typeof routes['media-modules.destroy']
    generate: typeof routes['media-modules.generate']
    exportPptx: typeof routes['media-modules.exportPptx']
    exportPdf: typeof routes['media-modules.exportPdf']
  }
  paudAssessments: {
    index: typeof routes['paud-assessments.index']
    store: typeof routes['paud-assessments.store']
    generateAi: typeof routes['paud-assessments.generateAi']
    exportBundle: typeof routes['paud-assessments.exportBundle']
    exportBundlePdf: typeof routes['paud-assessments.exportBundlePdf']
    update: typeof routes['paud-assessments.update']
    destroy: typeof routes['paud-assessments.destroy']
    export: typeof routes['paud-assessments.export']
    exportPdf: typeof routes['paud-assessments.exportPdf']
    attachments: {
      show: typeof routes['paud-assessments.attachments.show']
    }
  }
  assessments: {
    index: typeof routes['assessments.index']
    store: typeof routes['assessments.store']
    show: typeof routes['assessments.show']
    updateScores: typeof routes['assessments.updateScores']
    destroy: typeof routes['assessments.destroy']
    export: typeof routes['assessments.export']
    exportDocx: typeof routes['assessments.exportDocx']
    exportPdf: typeof routes['assessments.exportPdf']
  }
  principal: {
    index: typeof routes['principal.index']
    teacher: typeof routes['principal.teacher']
  }
  reportCards: {
    index: typeof routes['report-cards.index']
    show: typeof routes['report-cards.show']
    exportPdf: typeof routes['report-cards.exportPdf']
    exportDocx: typeof routes['report-cards.exportDocx']
    narratives: {
      save: typeof routes['report-cards.narratives.save']
      generate: typeof routes['report-cards.narratives.generate']
    }
  }
  reportNarratives: {
    approve: typeof routes['report-narratives.approve']
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
    fraud: {
      index: typeof routes['admin.fraud.index']
      review: typeof routes['admin.fraud.review']
    }
    packages: {
      index: typeof routes['admin.packages.index']
      store: typeof routes['admin.packages.store']
      update: typeof routes['admin.packages.update']
      destroy: typeof routes['admin.packages.destroy']
    }
    entitlements: {
      index: typeof routes['admin.entitlements.index']
      update: typeof routes['admin.entitlements.update']
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
      oauth: {
        openai: {
          start: typeof routes['admin.ai-settings.oauth.openai.start']
        }
        gemini: {
          start: typeof routes['admin.ai-settings.oauth.gemini.start']
          callback: typeof routes['admin.ai-settings.oauth.gemini.callback']
        }
      }
    }
    curriculumPresets: {
      index: typeof routes['admin.curriculum-presets.index']
      store: typeof routes['admin.curriculum-presets.store']
      update: typeof routes['admin.curriculum-presets.update']
      destroy: typeof routes['admin.curriculum-presets.destroy']
      resetDefaults: typeof routes['admin.curriculum-presets.resetDefaults']
    }
  }
}
