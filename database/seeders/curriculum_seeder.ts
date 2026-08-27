import { BaseSeeder } from '@adonisjs/lucid/seeders'
import CurriculumCp from '#models/curriculum_cp'
import LearningObjective from '#models/learning_objective'
import IktpIndicator from '#models/iktp_indicator'
import { RPPM_KBC_SEMESTER_1 } from './rppm_kbc_semester1_seeder.js'

export default class CurriculumSeeder extends BaseSeeder {
  async run() {
    // 1. Ensure Standard PAUD Capaian Pembelajaran (CP) Exist
    const cpAgama = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-AGAMA' },
      {
        code: 'CP-FONDASI-AGAMA',
        element: 'Nilai Agama dan Budi Pekerti',
        title: 'Mengenal dan mempraktikkan nilai agama serta akhlak mulia',
        description:
          'Anak mengenal Tuhan Yang Maha Esa, mempraktikkan ajaran pokok agama, dan menunjukkan perilaku baik dalam kehidupan sehari-hari.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    const cpJatiDiri = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-JATI-DIRI' },
      {
        code: 'CP-FONDASI-JATI-DIRI',
        element: 'Jati Diri',
        title: 'Membangun jati diri dan kemampuan sosial emosional',
        description:
          'Anak mengenali identitas diri, mengelola emosi, membangun hubungan sehat, serta berpartisipasi dalam lingkungan.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    const cpLiterasi = await CurriculumCp.updateOrCreate(
      { code: 'CP-FONDASI-LITERASI' },
      {
        code: 'CP-FONDASI-LITERASI',
        element: 'Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
        title: 'Mengembangkan kemampuan literasi dan eksplorasi',
        description:
          'Anak mengeksplorasi bahasa, matematika, sains, teknologi, rekayasa, dan seni melalui bermain dan pengalaman bermakna.',
        phase: 'Fondasi',
        curriculumVersion: 'Kurikulum Merdeka',
        isOfficial: true,
      }
    )

    // 2. Clean old dummy TPs without IKTP if any
    await LearningObjective.query()
      .where('source', 'library')
      .where('code', 'like', 'TP-%')
      .whereNot('code', 'like', 'TP-KBC-%')
      .delete()

    // 3. Seed Master Learning Objectives (TP) & IKTP Indicators mapped to CP
    const masterAtpItems: {
      learningObjectiveId: number
      order: number
      period: string
      unitTopic?: string
    }[] = []

    for (const item of RPPM_KBC_SEMESTER_1) {
      const cpText = (item.learningDesign?.cp || '').toLowerCase()
      let targetCp = cpLiterasi
      if (
        cpText.includes('agama') ||
        cpText.includes('budi pekerti') ||
        cpText.includes('syukur')
      ) {
        targetCp = cpAgama
      } else if (
        cpText.includes('jati diri') ||
        cpText.includes('identitas') ||
        cpText.includes('emosi')
      ) {
        targetCp = cpJatiDiri
      }

      // Bersihkan prefix [M... ...] - gunakan kalimat Tujuan Pembelajaran murni
      const tpTitle = item.learningDesign.tp
      const objective = await LearningObjective.updateOrCreate(
        {
          code: `TP-KBC-B-W${String(item.weekNum).padStart(2, '0')}`,
        },
        {
          cpId: targetCp.id,
          userId: null,
          code: `TP-KBC-B-W${String(item.weekNum).padStart(2, '0')}`,
          title: tpTitle,
          groupContext: 'b',
          source: 'library',
        }
      )

      const getUnitTopic = (weekNum: number) => {
        if (weekNum <= 5) return 'Unit 1: Diriku & Cinta Tanah Air (Minggu 1 – 5)'
        if (weekNum <= 8) return 'Unit 2: Lingkunganku yang Bersih & Sehat (Minggu 6 – 8)'
        if (weekNum <= 12) return 'Unit 3: Binatang Ciptaan Tuhan (Minggu 9 – 12)'
        if (weekNum <= 14) return 'Unit 4: Kebutuhanku (Makanan Sehat & Pakaian) (Minggu 13 – 14)'
        return 'Unit 5: Mitigasi Bencana & Fenomena Alam (Minggu 15 – 18)'
      }

      masterAtpItems.push({
        learningObjectiveId: objective.id,
        order: item.weekNum,
        period: `Minggu ${item.weekNum}: ${item.topic} - ${item.subtopic}`,
        unitTopic: getUnitTopic(item.weekNum),
      })

      if (item.iktpItems?.length > 0) {
        for (const iktp of item.iktpItems) {
          await IktpIndicator.updateOrCreate(
            {
              learningObjectiveId: objective.id,
              description: iktp.indicator,
            },
            {
              learningObjectiveId: objective.id,
              userId: null,
              description: iktp.indicator,
              evidenceType: 'checklist',
              achievementCriteria: `Ketercapaian Minggu ${item.weekNum}: ${item.subtopic}`,
            }
          )
        }
      }
    }

    console.log(
      'Successfully synced master CP, TP, and IKTP library in curriculum_seeder without prefix.'
    )
  }
}
