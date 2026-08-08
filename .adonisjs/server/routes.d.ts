import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'terms': { paramsTuple?: []; params?: {} }
    'coming-soon': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'account.package': { paramsTuple?: []; params?: {} }
    'account.usage': { paramsTuple?: []; params?: {} }
    'account.subscriptions': { paramsTuple?: []; params?: {} }
    'glossary.index': { paramsTuple?: []; params?: {} }
    'curriculum.index': { paramsTuple?: []; params?: {} }
    'curriculum.export': { paramsTuple?: []; params?: {} }
    'curriculum.exportPdf': { paramsTuple?: []; params?: {} }
    'documents.autosave': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'documents.status': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'documents.duplicate': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'curriculum.objectives.store': { paramsTuple?: []; params?: {} }
    'curriculum.sequences.store': { paramsTuple?: []; params?: {} }
    'curriculum.sequences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'curriculum.sequences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'curriculum.indicators.store': { paramsTuple?: []; params?: {} }
    'curriculum.presets.seed': { paramsTuple?: []; params?: {} }
    'curriculum.presets.reset': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.store': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.addStudent': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.importStudents': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.updateStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'classes.removeStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.store': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.generate': { paramsTuple?: []; params?: {} }
    'teaching-modules.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.generate': { paramsTuple?: []; params?: {} }
    'exams.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.store': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.generate': { paramsTuple?: []; params?: {} }
    'annual-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.store': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.generate': { paramsTuple?: []; params?: {} }
    'semester-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.index': { paramsTuple?: []; params?: {} }
    'rppm.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.generate': { paramsTuple?: []; params?: {} }
    'rpph.index': { paramsTuple?: []; params?: {} }
    'rpph.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.generate': { paramsTuple?: []; params?: {} }
    'lkpd.index': { paramsTuple?: []; params?: {} }
    'lkpd.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.generate': { paramsTuple?: []; params?: {} }
    'media-modules.index': { paramsTuple?: []; params?: {} }
    'media-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.generate': { paramsTuple?: []; params?: {} }
    'media-modules.exportPptx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.index': { paramsTuple?: []; params?: {} }
    'paud-assessments.store': { paramsTuple?: []; params?: {} }
    'paud-assessments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.attachments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'attachmentId': ParamValue} }
    'assessments.index': { paramsTuple?: []; params?: {} }
    'assessments.store': { paramsTuple?: []; params?: {} }
    'assessments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.updateScores': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportDocx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'principal.index': { paramsTuple?: []; params?: {} }
    'principal.teacher': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'report-cards.index': { paramsTuple?: []; params?: {} }
    'report-cards.show': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue} }
    'report-cards.exportPdf': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.exportDocx': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.narratives.save': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.narratives.generate': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue} }
    'report-narratives.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'subjects.store': { paramsTuple?: []; params?: {} }
    'subjects.storeDefaults': { paramsTuple?: []; params?: {} }
    'subjects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'settings.update': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.packages.store': { paramsTuple?: []; params?: {} }
    'admin.packages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.entitlements.index': { paramsTuple?: []; params?: {} }
    'admin.entitlements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.academic-years.index': { paramsTuple?: []; params?: {} }
    'admin.academic-years.store': { paramsTuple?: []; params?: {} }
    'admin.academic-years.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.academic-years.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.schools.index': { paramsTuple?: []; params?: {} }
    'admin.schools.store': { paramsTuple?: []; params?: {} }
    'admin.schools.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.schools.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ai-settings.index': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.update': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.test': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.models': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.openai.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.callback': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'terms': { paramsTuple?: []; params?: {} }
    'coming-soon': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'account.package': { paramsTuple?: []; params?: {} }
    'account.usage': { paramsTuple?: []; params?: {} }
    'account.subscriptions': { paramsTuple?: []; params?: {} }
    'glossary.index': { paramsTuple?: []; params?: {} }
    'curriculum.index': { paramsTuple?: []; params?: {} }
    'curriculum.export': { paramsTuple?: []; params?: {} }
    'curriculum.exportPdf': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.index': { paramsTuple?: []; params?: {} }
    'rppm.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.index': { paramsTuple?: []; params?: {} }
    'rpph.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.index': { paramsTuple?: []; params?: {} }
    'lkpd.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.index': { paramsTuple?: []; params?: {} }
    'media-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.exportPptx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.index': { paramsTuple?: []; params?: {} }
    'paud-assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.attachments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'attachmentId': ParamValue} }
    'assessments.index': { paramsTuple?: []; params?: {} }
    'assessments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportDocx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'principal.index': { paramsTuple?: []; params?: {} }
    'principal.teacher': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'report-cards.index': { paramsTuple?: []; params?: {} }
    'report-cards.show': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue} }
    'report-cards.exportPdf': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.exportDocx': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.entitlements.index': { paramsTuple?: []; params?: {} }
    'admin.academic-years.index': { paramsTuple?: []; params?: {} }
    'admin.schools.index': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.index': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.openai.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.callback': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'health': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'terms': { paramsTuple?: []; params?: {} }
    'coming-soon': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'auth.google.redirect': { paramsTuple?: []; params?: {} }
    'auth.google.callback': { paramsTuple?: []; params?: {} }
    'onboarding.index': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'account.package': { paramsTuple?: []; params?: {} }
    'account.usage': { paramsTuple?: []; params?: {} }
    'account.subscriptions': { paramsTuple?: []; params?: {} }
    'glossary.index': { paramsTuple?: []; params?: {} }
    'curriculum.index': { paramsTuple?: []; params?: {} }
    'curriculum.export': { paramsTuple?: []; params?: {} }
    'curriculum.exportPdf': { paramsTuple?: []; params?: {} }
    'classes.index': { paramsTuple?: []; params?: {} }
    'classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.index': { paramsTuple?: []; params?: {} }
    'teaching-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.index': { paramsTuple?: []; params?: {} }
    'exams.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.index': { paramsTuple?: []; params?: {} }
    'annual-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.index': { paramsTuple?: []; params?: {} }
    'semester-plans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.index': { paramsTuple?: []; params?: {} }
    'rppm.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.index': { paramsTuple?: []; params?: {} }
    'rpph.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.index': { paramsTuple?: []; params?: {} }
    'lkpd.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.index': { paramsTuple?: []; params?: {} }
    'media-modules.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.exportPptx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.index': { paramsTuple?: []; params?: {} }
    'paud-assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.attachments.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'attachmentId': ParamValue} }
    'assessments.index': { paramsTuple?: []; params?: {} }
    'assessments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.export': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportDocx': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.exportPdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'principal.index': { paramsTuple?: []; params?: {} }
    'principal.teacher': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'report-cards.index': { paramsTuple?: []; params?: {} }
    'report-cards.show': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue} }
    'report-cards.exportPdf': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.exportDocx': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'subjects.index': { paramsTuple?: []; params?: {} }
    'settings.index': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.packages.index': { paramsTuple?: []; params?: {} }
    'admin.entitlements.index': { paramsTuple?: []; params?: {} }
    'admin.academic-years.index': { paramsTuple?: []; params?: {} }
    'admin.schools.index': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.index': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.openai.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.start': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.oauth.gemini.callback': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.store': { paramsTuple?: []; params?: {} }
    'documents.autosave': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'documents.status': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'documents.duplicate': { paramsTuple: [ParamValue,ParamValue]; params: {'type': ParamValue,'id': ParamValue} }
    'curriculum.objectives.store': { paramsTuple?: []; params?: {} }
    'curriculum.sequences.store': { paramsTuple?: []; params?: {} }
    'curriculum.indicators.store': { paramsTuple?: []; params?: {} }
    'curriculum.presets.seed': { paramsTuple?: []; params?: {} }
    'curriculum.presets.reset': { paramsTuple?: []; params?: {} }
    'classes.store': { paramsTuple?: []; params?: {} }
    'classes.addStudent': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.importStudents': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teaching-modules.store': { paramsTuple?: []; params?: {} }
    'teaching-modules.generate': { paramsTuple?: []; params?: {} }
    'exams.store': { paramsTuple?: []; params?: {} }
    'exams.generate': { paramsTuple?: []; params?: {} }
    'annual-plans.store': { paramsTuple?: []; params?: {} }
    'annual-plans.generate': { paramsTuple?: []; params?: {} }
    'semester-plans.store': { paramsTuple?: []; params?: {} }
    'semester-plans.generate': { paramsTuple?: []; params?: {} }
    'rppm.generate': { paramsTuple?: []; params?: {} }
    'rpph.generate': { paramsTuple?: []; params?: {} }
    'lkpd.generate': { paramsTuple?: []; params?: {} }
    'media-modules.generate': { paramsTuple?: []; params?: {} }
    'paud-assessments.store': { paramsTuple?: []; params?: {} }
    'assessments.store': { paramsTuple?: []; params?: {} }
    'report-cards.narratives.save': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue,'studentId': ParamValue} }
    'report-cards.narratives.generate': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'semesterId': ParamValue} }
    'report-narratives.approve': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.store': { paramsTuple?: []; params?: {} }
    'subjects.storeDefaults': { paramsTuple?: []; params?: {} }
    'admin.packages.store': { paramsTuple?: []; params?: {} }
    'admin.academic-years.store': { paramsTuple?: []; params?: {} }
    'admin.schools.store': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.test': { paramsTuple?: []; params?: {} }
    'admin.ai-settings.models': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'curriculum.sequences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.updateStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'teaching-modules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.updateScores': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.update': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.entitlements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.academic-years.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.schools.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ai-settings.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'curriculum.sequences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'classes.removeStudent': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'studentId': ParamValue} }
    'teaching-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exams.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'annual-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'semester-plans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rppm.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rpph.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lkpd.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'media-modules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'paud-assessments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'assessments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'subjects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.packages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.academic-years.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.schools.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}