import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CurriculumCp from '#models/curriculum_cp'
import LearningObjective from '#models/learning_objective'

export default class CurriculumSeeder extends BaseSeeder {
  async run() {
    const library = [
      {
        code: 'CP-FONDASI-AGAMA',
        element: 'Nilai Agama dan Budi Pekerti',
        title: 'Mengenal dan mempraktikkan nilai agama serta akhlak mulia',
        description:
          'Anak mengenal Tuhan Yang Maha Esa, mempraktikkan ajaran pokok agama, dan menunjukkan perilaku baik dalam kehidupan sehari-hari.',
      },
      {
        code: 'CP-FONDASI-JATI-DIRI',
        element: 'Jati Diri',
        title: 'Membangun jati diri dan kemampuan sosial emosional',
        description:
          'Anak mengenali identitas diri, mengelola emosi, membangun hubungan sehat, serta berpartisipasi dalam lingkungan.',
      },
      {
        code: 'CP-FONDASI-LITERASI',
        element: 'Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
        title: 'Mengembangkan kemampuan literasi dan eksplorasi',
        description:
          'Anak mengeksplorasi bahasa, matematika, sains, teknologi, rekayasa, dan seni melalui bermain dan pengalaman bermakna.',
      },
    ]

    for (const item of library) {
      const cp = await CurriculumCp.updateOrCreate(
        { code: item.code },
        { ...item, phase: 'Fondasi', curriculumVersion: 'Kurikulum Merdeka', isOfficial: true }
      )
      const objectives =
        item.code === 'CP-FONDASI-AGAMA'
          ? [
              'Mengenal kebiasaan baik dalam kehidupan sehari-hari',
              'Menunjukkan perilaku santun dan peduli kepada orang lain',
            ]
          : item.code === 'CP-FONDASI-JATI-DIRI'
            ? [
                'Mengenali emosi diri dan cara mengekspresikannya',
                'Berpartisipasi dalam kegiatan bersama teman',
              ]
            : [
                'Menyimak dan mengomunikasikan ide melalui berbagai media',
                'Mengelompokkan benda berdasarkan ciri yang diamati',
              ]
      for (const [index, title] of objectives.entries()) {
        await LearningObjective.updateOrCreate(
          { cpId: cp.id, code: `TP-${cp.id}-${index + 1}`, userId: null },
          {
            cpId: cp.id,
            code: `TP-${cp.id}-${index + 1}`,
            title,
            groupContext: null,
            source: 'library',
          }
        )
      }
    }
  }
}
