import { Head, Link } from '@inertiajs/react'
import type { ReactNode } from 'react'

const features = [
  {
    icon: '📋',
    title: 'Perencanaan',
    description: 'Prota, Promes, ATP otomatis',
  },
  {
    icon: '🎯',
    title: 'Modul Ajar',
    description: 'Generate RPP/Modul Ajar AI dalam 2 menit',
  },
  {
    icon: '📝',
    title: 'Soal',
    description: 'Buat soal PTS/PAS/PAT + kunci jawaban',
  },
  {
    icon: '📊',
    title: 'Rapor',
    description: 'Narasi rapor personal per siswa',
  },
  {
    icon: '🏆',
    title: 'Peringkat',
    description: 'Ranking otomatis + sertifikat',
  },
  {
    icon: '🔗',
    title: 'Integrasi',
    description: 'Sinkron RPT Digital & Dapodik',
  },
]

const steps = [
  {
    step: '1',
    title: 'Daftar & Isi Data Kelas',
    description: 'Buat akun gratis, masukkan data kelas dan mata pelajaran Anda',
  },
  {
    step: '2',
    title: 'Pilih Dokumen → Generate dengan AI',
    description: 'Pilih dokumen yang dibutuhkan, biarkan AI membuatkan untuk Anda',
  },
  {
    step: '3',
    title: 'Edit, Export, Kirim — selesai!',
    description: 'Sunting jika perlu, export ke PDF/DOCX, kirim ke orang tua via WhatsApp',
  },
]

const pricing = [
  {
    name: 'Free',
    price: 'Gratis',
    period: '',
    features: [
      '1 kelas',
      '5 dokumen/bulan',
      'Modul Ajar dasar',
      'Export PDF',
    ],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 'Rp25.000',
    period: '/bulan',
    features: [
      '3 kelas',
      '30 dokumen/bulan',
      'Semua fitur AI',
      'Export PDF & DOCX',
      'Rapor narasi',
    ],
    cta: 'Pilih Basic',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Rp45.000',
    period: '/bulan',
    features: [
      '10 kelas',
      'Unlimited dokumen',
      'Semua fitur AI',
      'Export PDF & DOCX',
      'Rapor narasi',
      'Peringkat & sertifikat',
      'Integrasi RPT Digital',
      'Priority support',
    ],
    cta: 'Pilih Pro',
    highlighted: true,
  },
  {
    name: 'Sekolah',
    price: 'Rp300.000',
    period: '/bulan',
    features: [
      'Unlimited kelas',
      'Unlimited dokumen',
      'Semua fitur Pro',
      'Dashboard Kepala Sekolah',
      'Multi-guru (10 akun)',
      'Laporan administrasi',
      'Dedicated support',
    ],
    cta: 'Hubungi Kami',
    highlighted: false,
  },
]

const testimonials = [
  {
    name: 'Bu Rina',
    role: 'Guru TK B',
    quote: 'Rapor narasi yang dulu makan waktu 2 minggu, sekarang selesai dalam 2 jam!',
  },
  {
    name: 'Pak Budi',
    role: 'Wali Kelas 3 SD',
    quote: 'Semua dokumen admin dari Prota sampai rapor ada di satu tempat. Sangat membantu!',
  },
  {
    name: 'Pak Hendra',
    role: 'Kepala Sekolah SD',
    quote: 'Bisa pantau kelengkapan administrasi semua guru dari dashboard. Luar biasa!',
  },
]

const faqs = [
  {
    question: 'Apakah SiapAjar sesuai dengan Kurikulum Merdeka?',
    answer: 'Ya, SiapAjar dirancang khusus untuk Kurikulum Merdeka dengan istilah CP, ATP, TP, KKTP, dan format modul ajar terbaru.',
  },
  {
    question: 'Bagaimana cara kerja AI di SiapAjar?',
    answer: 'AI kami dilatih khusus untuk dokumen administrasi guru. Cukup input data kelas dan mapel, AI akan generate dokumen sesuai format Kurikulum Merdeka.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, kami menggunakan enkripsi SSL dan tidak membagikan data Anda ke pihak ketiga. Data tersimpan di server Indonesia.',
  },
  {
    question: 'Bisa export ke format apa saja?',
    answer: 'PDF dan DOCX (Microsoft Word). Anda bisa langsung mencetak atau mengirim ke WhatsApp orang tua.',
  },
  {
    question: 'Apakah ada versi trial?',
    answer: 'Ya, akun gratis tersedia dengan 1 kelas dan 5 dokumen/bulan. Upgrade kapan saja tanpa kartu kredit.',
  },
]

export default function Landing() {
  return (
    <>
      <Head title="SiapAjar — Siap Mengajar, Siap Administrasi">
        <meta name="description" content="Platform all-in-one administrasi guru Kurikulum Merdeka. Buat Prota, Modul Ajar, Soal, Rapor — semua otomatis dari satu tempat." />
      </Head>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'white', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
          SiapAjar
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#374151', textDecoration: 'none' }}>Fitur</a>
          <a href="#pricing" style={{ color: '#374151', textDecoration: 'none' }}>Harga</a>
          <a href="#faq" style={{ color: '#374151', textDecoration: 'none' }}>FAQ</a>
          <Link href="/login" style={{ color: '#374151', textDecoration: 'none' }}>Login</Link>
          <Link href="/signup" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
            Mulai Gratis
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
            Fajar Baru Administrasi Guru
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>
            Buat Prota, Modul Ajar, Soal, Rapor — semua otomatis dari satu tempat
          </p>
          <Link href="/signup" style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Mulai Gratis
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '1rem' }}>
            Masalah yang Dihadapi Guru
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
            Guru menghabiskan 40-60% waktu untuk administrasi, bukan mengajar
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔀</div>
              <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Fragmentasi Tools</h3>
              <p style={{ color: '#6b7280' }}>Modul ajar di platform A, soal di platform B, rapor di aplikasi desktop C</p>
            </div>
            <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Kurva Belajar KM</h3>
              <p style={{ color: '#6b7280' }}>Istilah CP, ATP, TP, KKTP masih baru dan membingungkan banyak guru</p>
            </div>
            <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
              <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>Tidak Ada Otomatisasi</h3>
              <p style={{ color: '#6b7280' }}>Prota, Promes, ATP disusun manual dari nol setiap tahun</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.125rem', color: '#2563eb', fontWeight: 'bold' }}>
            SiapAjar selesaikan semua dalam satu platform
          </p>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            Fitur Utama
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((feature, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: '#6b7280' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            Cara Kerja
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', flexShrink: 0 }}>
                  {step.step}
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>{step.title}</h3>
                  <p style={{ color: '#6b7280' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            Apa Kata Guru?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#4b5563', fontStyle: 'italic', marginBottom: '1rem' }}>"{testimonial.quote}"</p>
                <p style={{ fontWeight: 'bold', color: '#374151' }}>{testimonial.name}</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            Harga
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {pricing.map((plan, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: plan.highlighted ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: plan.highlighted ? '#eff6ff' : 'white',
                position: 'relative',
              }}>
                {plan.highlighted && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    Recommended
                  </div>
                )}
                <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1rem' }}>
                  {plan.price}<span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '1.5rem' }}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{ padding: '0.25rem 0', color: '#4b5563' }}>✓ {feature}</li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.75rem',
                  background: plan.highlighted ? '#2563eb' : 'white',
                  color: plan.highlighted ? 'white' : '#2563eb',
                  border: plan.highlighted ? 'none' : '1px solid #2563eb',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            Pertanyaan Umum
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>{faq.question}</h3>
                <p style={{ color: '#6b7280' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            Mulai Gratis Sekarang
          </h2>
          <p style={{ color: '#bfdbfe', marginBottom: '1.5rem' }}>
            Tidak perlu kartu kredit. Mulai buat dokumen admin dalam 2 menit.
          </p>
          <Link href="/signup" style={{ display: 'inline-block', background: 'white', color: '#2563eb', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Mulai Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', background: '#1f2937', color: '#d1d5db' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>SiapAjar</div>
            <p style={{ fontSize: '0.875rem' }}>Siap Mengajar, Siap Administrasi</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Tautan</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.25rem' }}><a href="#features" style={{ color: '#d1d5db', textDecoration: 'none' }}>Fitur</a></li>
              <li style={{ marginBottom: '0.25rem' }}><a href="#pricing" style={{ color: '#d1d5db', textDecoration: 'none' }}>Harga</a></li>
              <li style={{ marginBottom: '0.25rem' }}><a href="#faq" style={{ color: '#d1d5db', textDecoration: 'none' }}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Kontak</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.25rem' }}>WhatsApp</li>
              <li style={{ marginBottom: '0.25rem' }}>Instagram</li>
              <li style={{ marginBottom: '0.25rem' }}>TikTok</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '1000px', margin: '2rem auto 0', paddingTop: '1rem', borderTop: '1px solid #374151', textAlign: 'center', fontSize: '0.875rem' }}>
          © 2026 SiapAjar. All rights reserved.
        </div>
      </footer>
    </>
  )
}
