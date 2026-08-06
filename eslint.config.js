import { configApp } from '@adonisjs/eslint-config'
import { react } from '@adonisjs/eslint-config/react'

export default [
  ...configApp(...react),
  {
    rules: {
      '@adonisjs/prefer-adonisjs-inertia-link': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@unicorn/filename-case': 'off',
    },
  },
]
