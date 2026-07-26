import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'coming-soon': ExtractProps<(typeof import('../../inertia/pages/coming-soon.tsx'))['default']>
    'dashboard/admin/academic-years/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/admin/academic-years/index.tsx'))['default']>
    'dashboard/admin/ai-settings/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/admin/ai-settings/index.tsx'))['default']>
    'dashboard/admin/packages/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/admin/packages/index.tsx'))['default']>
    'dashboard/admin/users/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/admin/users/index.tsx'))['default']>
    'dashboard/annual-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/annual-plans/index.tsx'))['default']>
    'dashboard/annual-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/annual-plans/show.tsx'))['default']>
    'dashboard/assessments/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/assessments/index.tsx'))['default']>
    'dashboard/assessments/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/assessments/show.tsx'))['default']>
    'dashboard/classes/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/classes/index.tsx'))['default']>
    'dashboard/classes/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/classes/show.tsx'))['default']>
    'dashboard/daily-lesson-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/daily-lesson-plans/index.tsx'))['default']>
    'dashboard/daily-lesson-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/daily-lesson-plans/show.tsx'))['default']>
    'dashboard/exams/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/exams/index.tsx'))['default']>
    'dashboard/exams/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/exams/show.tsx'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.tsx'))['default']>
    'dashboard/paud-assessments/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/paud-assessments/index.tsx'))['default']>
    'dashboard/report-cards/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/report-cards/index.tsx'))['default']>
    'dashboard/report-cards/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/report-cards/show.tsx'))['default']>
    'dashboard/semester-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/semester-plans/index.tsx'))['default']>
    'dashboard/semester-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/semester-plans/show.tsx'))['default']>
    'dashboard/settings': ExtractProps<(typeof import('../../inertia/pages/dashboard/settings.tsx'))['default']>
    'dashboard/subjects/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/subjects/index.tsx'))['default']>
    'dashboard/teaching-modules/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/teaching-modules/index.tsx'))['default']>
    'dashboard/teaching-modules/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/teaching-modules/show.tsx'))['default']>
    'dashboard/weekly-lesson-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/weekly-lesson-plans/index.tsx'))['default']>
    'dashboard/weekly-lesson-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/weekly-lesson-plans/show.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'onboarding': ExtractProps<(typeof import('../../inertia/pages/onboarding.tsx'))['default']>
  }
}
