import { test } from '@japa/runner'
import {
  parseToonAnecdote,
  parseToonChecklist,
  parseToonWorkSample,
  parseToonPhotoSeries,
} from '#services/paud_assessment_ai_service'

test.group('Paud Assessment TOON Parsers', () => {
  test('parseToonAnecdote correctly parses TOON block', ({ assert }) => {
    const rawToon = `
[TOON:ANEKDOT]
KEJADIAN:: Fatih sedang menyusun balok kayu menjadi menara tinggi. Ketika temannya ingin meminjam balok, Fatih memberikan dua balok kayu sambil tersenyum dan berkata: "Ini buat kamu satu lagi ya".
ANALISIS:: Fatih menunjukkan perkembangan positif pada Elemen Jati Diri dan Nilai Agama & Budi Pekerti, mampu mengendalikan emosi dan menunjukkan sikap berbagi secara prososial.
[/TOON]
`
    const result = parseToonAnecdote({ toon: rawToon })
    assert.include(result.kejadianTeramati, 'Fatih sedang menyusun balok')
    assert.include(result.kejadianTeramati, 'Ini buat kamu satu lagi ya')
    assert.include(result.analisisCapaian, 'Elemen Jati Diri')
  })

  test('parseToonChecklist correctly parses multi-item TOON checklist', ({ assert }) => {
    const rawToon = `
[TOON:CEKLIS]
ITEM:: Mengucapkan salam saat memasuki ruangan | sudah_muncul | Masuk kelas mengucapkan salam dengan ceria
ITEM:: Merapikan mainan ke tempat semula setelah selesai | belum_muncul | Masih perlu diingatkan guru untuk merapikan balok
ITEM:: Mampu bekerjasama membuat istana pasir | sudah_muncul | Bermain bersama 2 temannya di bak pasir
NOTE:: Ananda sangat adaptif dan aktif dalam kegiatan motorik kasar.
[/TOON]
`
    const result = parseToonChecklist({ toon: rawToon })
    assert.equal(result.items.length, 3)
    assert.equal(result.items[0].indicator, 'Mengucapkan salam saat memasuki ruangan')
    assert.equal(result.items[0].status, 'sudah_muncul')
    assert.equal(result.items[0].event, 'Masuk kelas mengucapkan salam dengan ceria')

    assert.equal(result.items[1].indicator, 'Merapikan mainan ke tempat semula setelah selesai')
    assert.equal(result.items[1].status, 'belum_muncul')

    assert.equal(result.items[2].status, 'sudah_muncul')
    assert.include(result.generalNote, 'Ananda sangat adaptif')
  })

  test('parseToonWorkSample correctly parses TOON work sample', ({ assert }) => {
    const rawToon = `
[TOON:KARYA]
DESKRIPSI:: Menggambar pemandangan pegunungan dengan crayon warna hijau dan biru. Anak berkata: "Ini gunung yang dingin tempat aku liburan".
ANALISIS:: Kemampuan motorik halus dalam memegang alat warna sangat stabil. Menunjukkan konsep spasial dan pemilihan warna yang kaya.
[/TOON]
`
    const result = parseToonWorkSample({ toon: rawToon })
    assert.include(result.workDescription, 'Menggambar pemandangan pegunungan')
    assert.include(result.workDescription, 'tempat aku liburan')
    assert.include(result.achievementAnalysis, 'Kemampuan motorik halus')
  })

  test('parseToonPhotoSeries correctly parses 3 steps photo series TOON', ({ assert }) => {
    const rawToon = `
[TOON:FOTOBERSERI]
TAHAP1:: Memilih bahan kertas lipat dan gunting khusus anak secara mandiri.
TAHAP2:: Mengikuti instruksi guru melipat pola segitiga dan menggunting bagian tepi.
TAHAP3:: Menempelkan hasil karya kupu-kupu ke buku portofolio dan menunjukkan ke guru.
ANALISIS:: Menunjukkan kemandirian, ketelitian motorik halus, serta kepatuhan mengikuti alur instruksi bertahap.
[/TOON]
`
    const result = parseToonPhotoSeries({ toon: rawToon })
    assert.equal(result.stepDescriptions.length, 3)
    assert.include(result.stepDescriptions[0], 'Memilih bahan kertas lipat')
    assert.include(result.stepDescriptions[1], 'Mengikuti instruksi guru')
    assert.include(result.stepDescriptions[2], 'Menempelkan hasil karya')
    assert.include(result.achievementAnalysis, 'Menunjukkan kemandirian')
  })

  test('parseToonChecklist fallback to JSON object seamlessly', ({ assert }) => {
    const jsonRes = {
      items: [
        {
          indicator: 'Berdoa sebelum makan',
          status: 'sudah_muncul',
          event: 'Mengangkat tangan dan berdoa dengan khusyuk',
        },
      ],
      generalNote: 'Perkembangan spiritual sangat baik',
    }
    const result = parseToonChecklist(jsonRes)
    assert.equal(result.items.length, 1)
    assert.equal(result.items[0].indicator, 'Berdoa sebelum makan')
    assert.equal(result.items[0].status, 'sudah_muncul')
    assert.equal(result.generalNote, 'Perkembangan spiritual sangat baik')
  })
})
