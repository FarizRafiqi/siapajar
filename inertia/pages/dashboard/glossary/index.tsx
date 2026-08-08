import DashboardWrapper from '~/components/dashboard/dashboard-wrapper'
import CurriculumGlossary from '~/components/dashboard/curriculum-glossary'
import { Head } from '@inertiajs/react'

export default function GlossaryIndex() {
  return (
    <DashboardWrapper
      title="Panduan Istilah"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Panduan Istilah' }]}
    >
      <Head title="Panduan Istilah — SiapAjar" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Panduan Istilah Kurikulum
          </h2>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Kenali CP, TP, ATP, IKTP, serta format dokumen pembelajaran yang digunakan di SiapAjar.
          </p>
        </div>
        <CurriculumGlossary />
      </div>
    </DashboardWrapper>
  )
}
