import { Head, Link } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { MailCheck } from 'lucide-react'

export default function VerifyEmail({ email }: { email: string }) {
  return (
    <>
      <Head title="Verifikasi Email — SiapAjar" />
      <main className="flex min-h-screen items-center justify-center bg-[#fbfbee] p-4">
        <section className="w-full max-w-lg rounded-3xl border-2 border-black bg-white p-8 text-center shadow-[6px_6px_0px_#000000]">
          <MailCheck className="mx-auto h-12 w-12 text-emerald-700" />
          <h1 className="mt-4 text-2xl font-bold text-neutral-950">Cek email Anda</h1>
          <p className="mt-2 text-sm text-neutral-800">
            Kami mengirim tautan verifikasi ke <strong>{email}</strong>. Buka tautan tersebut untuk
            melanjutkan aktivasi benefit gratis.
          </p>
          <Form route="email_verification.resend" className="mt-6">
            {({ processing }) => (
              <button
                type="submit"
                disabled={processing}
                className="btn-kawaii-primary w-full disabled:opacity-50"
              >
                {processing ? 'Mengirim...' : 'Kirim ulang email verifikasi'}
              </button>
            )}
          </Form>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="mt-5 text-sm font-semibold text-emerald-800 hover:underline"
          >
            Gunakan akun lain
          </Link>
        </section>
      </main>
    </>
  )
}
