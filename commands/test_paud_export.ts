import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import SchoolClass from '#models/school_class'
import Student from '#models/student'
import PaudAssessment from '#models/paud_assessment'
import { exportPaudAssessment, exportPaudAssessmentBundle } from '#services/export_service'
import {
  exportPaudAssessmentPdf,
  exportPaudAssessmentBundlePdf,
} from '#services/pdf_export_service'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { DateTime } from 'luxon'

export default class TestPaudExport extends BaseCommand {
  static commandName = 'test:paud-export'
  static description = 'Test generating PAUD assessment DOCX and PDF exports matching PPM KBC'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting PAUD Assessment Export Verification...')

    const user = await User.findBy('email', 'gurutk@siapajar.id')
    if (!user) {
      this.logger.error('User gurutk@siapajar.id not found!')
      return
    }

    const outDir = join(process.cwd(), 'scratch', 'exports')
    await mkdir(outDir, { recursive: true })

    // Find or create class & student for test
    let schoolClass = await SchoolClass.query().where('user_id', user.id).first()
    if (!schoolClass) {
      schoolClass = await SchoolClass.create({
        userId: user.id,
        name: 'B (5-6 Tahun)',
      })
    }

    let student = await Student.query().where('class_id', schoolClass.id).first()
    if (!student) {
      student = await Student.create({
        classId: schoolClass.id,
        nis: '2026001',
        fullName: 'Aisyah Putri Humaira',
      })
    }

    // 1. Create sample Anecdotal Assessment
    const anecdotalAssessment = new PaudAssessment()
    anecdotalAssessment.fill({
      userId: user.id,
      classId: schoolClass.id,
      studentId: student.id,
      type: 'anecdotal_note',
      date: DateTime.fromISO('2026-08-16'),
      activity: 'Bermain Balok dan Menyusun Menara Masjid',
      content: {
        theme: 'Kenalkan',
        context: 'Di area balok saat kegiatan main bebas pagi hari',
        observedEvent:
          'Aisyah mengambil 6 balok kubus kayu, menyusunnya tegak ke atas, lalu meletakkan balok segitiga di puncaknya sambil tersenyum dan berkata: "Lihat Bu Guru, menara masjidku sudah tinggi!" Ketika balok tersenggol teman dan runtuh, Aisyah menarik napas, tersenyum, lalu menyusunnya kembali dengan sabar.',
        achievementAnalysis:
          'Aisyah menunjukkan capaian Elemen Nilai Agama dan Budi Pekerti (mensyukuri hasil karya & bersabar), serta Elemen Dasar Literasi dan STEAM (memahami konsep keseimbangan struktur geometri balok dan kestabilan vertikal).',
      },
    })
    Object.assign(anecdotalAssessment, { schoolClass, student })

    // 2. Create sample Checklist Assessment
    const checklistAssessment = new PaudAssessment()
    checklistAssessment.fill({
      userId: user.id,
      classId: schoolClass.id,
      studentId: student.id,
      type: 'checklist',
      date: DateTime.fromISO('2026-08-16'),
      activity: 'Pengamatan Perilaku Keseharian',
      content: {
        theme: 'Kenalkan',
        items: [
          {
            indicator: 'Anak terbiasa mengucapkan salam dan membalas sapaan guru serta teman',
            status: 'sudah_muncul',
            event: 'Mengucapkan "Assalamu’alaikum" dengan ceria saat tiba di gerbang sekolah',
          },
          {
            indicator: 'Anak mampu mengenali emosi diri dan menenangkan diri saat kecewa',
            status: 'sudah_muncul',
            event: 'Menarik napas dan tersenyum saat menara baloknya tidak sengaja runtuh',
          },
          {
            indicator: 'Anak mampu mengelompokkan benda berdasarkan bentuk dan ukuran geometri',
            status: 'sudah_muncul',
            event: 'Memilah balok persegi panjang dan segitiga ke dalam wadah yang sesuai',
          },
          {
            indicator: 'Anak mampu menggunakan gunting dengan pola garis melingkar secara mandiri',
            status: 'belum_muncul',
            event: 'Masih membutuhkan bimbingan guru saat menggunting pola lingkaran kecil',
          },
        ],
        note: 'Anak berkembang sangat baik pada aspek sosial emosional dan pemahaman konsep ruang.',
      },
    })
    Object.assign(checklistAssessment, { schoolClass, student })

    // 3. Create sample Work Sample Assessment
    const workSampleAssessment = new PaudAssessment()
    workSampleAssessment.fill({
      userId: user.id,
      classId: schoolClass.id,
      studentId: student.id,
      type: 'work_sample',
      date: DateTime.fromISO('2026-08-16'),
      activity: 'Kolase Bentuk Rumah dan Masjid',
      content: {
        theme: 'Kenalkan',
        workTitle: 'Kolase Rumah Impian Aisyah',
        workDescription:
          'Aisyah menyusun potongan kertas origami berbagai warna membentuk rumah dengan atap segitiga hijau, dinding persegi kuning, serta menambahkan hiasan bunga di halaman.',
        achievementAnalysis:
          'Keterampilan motorik halus Aisyah berkembang sangat baik dalam menempel presisi. Kemampuan estetika seni dan komunikasi terlihat jelas saat menceritakan detail rumah impiannya.',
      },
    })
    Object.assign(workSampleAssessment, { schoolClass, student })

    // 4. Create sample Photo Series Assessment
    const photoSeriesAssessment = new PaudAssessment()
    photoSeriesAssessment.fill({
      userId: user.id,
      classId: schoolClass.id,
      studentId: student.id,
      type: 'photo_series',
      date: DateTime.fromISO('2026-08-16'),
      activity: 'Eksplorasi Membuat Adonan Playdough Alami',
      content: {
        theme: 'Kenalkan',
        activityTitle: 'Membuat Adonan Playdough Warna-Warni',
        stepDescriptions: [
          'Tahap 1: Menakar tepung terigu, garam, dan minyak sayur ke dalam mangkuk baskom.',
          'Tahap 2: Menuangkan air hangat perlahan dan menguleni adonan hingga kalis dan kenyal.',
          'Tahap 3: Memberikan pewarna makanan alami (pandan & kunyit) lalu membentuk aneka kue.',
        ],
        achievementAnalysis:
          'Aisyah menunjukkan rasa ingin tahu tinggi, pemahaman konsep sebab-akibat (STEAM), kerja sama tim yang solid, serta kegigihan dalam menyelesaikan tantangan proyek.',
      },
    })
    Object.assign(photoSeriesAssessment, { schoolClass, student })

    const assessments = [
      anecdotalAssessment,
      checklistAssessment,
      workSampleAssessment,
      photoSeriesAssessment,
    ]

    // Generate individual exports
    this.logger.info('Generating Individual DOCX & PDF exports...')
    const anecdotalDocx = await exportPaudAssessment(anecdotalAssessment, user)
    await writeFile(join(outDir, '01_Anekdot_Aisyah.docx'), anecdotalDocx)

    const anecdotalPdf = await exportPaudAssessmentPdf(anecdotalAssessment, user, false)
    await writeFile(join(outDir, '01_Anekdot_Aisyah.pdf'), anecdotalPdf)

    const checklistDocx = await exportPaudAssessment(checklistAssessment, user)
    await writeFile(join(outDir, '02_Ceklis_Aisyah.docx'), checklistDocx)

    const checklistPdf = await exportPaudAssessmentPdf(checklistAssessment, user, false)
    await writeFile(join(outDir, '02_Ceklis_Aisyah.pdf'), checklistPdf)

    const workSampleDocx = await exportPaudAssessment(workSampleAssessment, user)
    await writeFile(join(outDir, '03_HasilKarya_Aisyah.docx'), workSampleDocx)

    const workSamplePdf = await exportPaudAssessmentPdf(workSampleAssessment, user, false)
    await writeFile(join(outDir, '03_HasilKarya_Aisyah.pdf'), workSamplePdf)

    const photoSeriesDocx = await exportPaudAssessment(photoSeriesAssessment, user)
    await writeFile(join(outDir, '04_FotoBerseri_Aisyah.docx'), photoSeriesDocx)

    const photoSeriesPdf = await exportPaudAssessmentPdf(photoSeriesAssessment, user, false)
    await writeFile(join(outDir, '04_FotoBerseri_Aisyah.pdf'), photoSeriesPdf)

    // Generate Bundle export
    this.logger.info('Generating Bundle DOCX & PDF exports (PPM KBC PM)...')
    const bundleDocx = await exportPaudAssessmentBundle(assessments, user, 'Kenalkan')
    await writeFile(join(outDir, '37_TK_B_Smt1_01_Kenalkan_Generated.docx'), bundleDocx)

    const bundlePdf = await exportPaudAssessmentBundlePdf(assessments, user, 'Kenalkan', false)
    await writeFile(join(outDir, '37_TK_B_Smt1_01_Kenalkan_Generated.pdf'), bundlePdf)

    this.logger.success('All DOCX and PDF exports generated successfully in scratch/exports/!')
  }
}
