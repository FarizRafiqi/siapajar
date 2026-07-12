import './css/app.css'
import 'sonner/dist/styles.css'
import { client } from '~/client'
import DefaultLayout from '~/layouts/default'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx')
    const noLayout = ['home', 'auth/login', 'auth/signup']
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      pages,
      noLayout.includes(name) ? undefined : DefaultLayout
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
