import { useEffect, type PropsWithChildren } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { urlFor } from '~/client'
import { toast, Toaster } from 'sonner'
import type { Data } from '@generated/data'

export default function DefaultLayout({ children }: PropsWithChildren) {
  const page = usePage<Data.SharedProps>()

  useEffect(() => {
    const flash = page.props.flash
    if (flash.error) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  }, [page.props.flash])

  const { post } = useForm()

  return (
    <>
      <header>
        <div>
          <div>
            <Link route="home">
              <svg
                width="66"
                height="24"
                viewBox="0 0 105 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0h7.5v15H0ZM7.5 15h7.5v15H7.5ZM15 30h7.5v7.5H15ZM22.5 15h7.5v15H22.5ZM30 0h7.5v15H30ZM45 0h7.5v30h15v-30h7.5v37.5h-30v-37.5ZM82.5 37.5V0H105v7.5H90V15h15v7.5H90V30h15v7.5H82.5Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
          <div>
            <nav>
              {page.props.user ? (
                <>
                  <span>{page.props.user.initials}</span>
                  <form onSubmit={(e) => { e.preventDefault(); post(urlFor('session.destroy')) }}>
                    <button type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link route="new_account.create">Signup</Link>
                  <Link route="session.create">Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <Toaster position="top-center" richColors />
    </>
  )
}
