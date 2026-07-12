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
    'dashboard/annual-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/annual-plans/index.tsx'))['default']>
    'dashboard/annual-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/annual-plans/show.tsx'))['default']>
    'dashboard/classes/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/classes/index.tsx'))['default']>
    'dashboard/classes/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/classes/show.tsx'))['default']>
    'dashboard/exams/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/exams/index.tsx'))['default']>
    'dashboard/exams/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/exams/show.tsx'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.tsx'))['default']>
    'dashboard/semester-plans/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/semester-plans/index.tsx'))['default']>
    'dashboard/semester-plans/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/semester-plans/show.tsx'))['default']>
    'dashboard/settings': ExtractProps<(typeof import('../../inertia/pages/dashboard/settings.tsx'))['default']>
    'dashboard/subjects/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/subjects/index.tsx'))['default']>
    'dashboard/teaching-modules/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/teaching-modules/index.tsx'))['default']>
    'dashboard/teaching-modules/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/teaching-modules/show.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'onboarding': ExtractProps<(typeof import('../../inertia/pages/onboarding.tsx'))['default']>
  }
}
