import AcademicYear from '#models/academic_year'
import CurriculumPreset from '#models/curriculum_preset'
import Package from '#models/package'
import PackageEntitlement from '#models/package_entitlement'
import School from '#models/school'
import User from '#models/user'
import { MASTER_KBC_PRESETS } from '#database/seeders/curriculum_preset_seeder'
import { getFeatureLabel } from '#services/entitlement_service'
import { schoolRepository } from '#repositories/school_repository'
import type { SchoolRepository } from '#repositories/school_repository'
import { curriculumPresetRepository } from '#repositories/curriculum_preset_repository'
import type { CurriculumPresetRepository } from '#repositories/curriculum_preset_repository'
import { packageEntitlementRepository } from '#repositories/package_entitlement_repository'
import type { PackageEntitlementRepository } from '#repositories/package_entitlement_repository'
import { adminUserRepository } from '#repositories/admin_user_repository'
import type { AdminUserRepository } from '#repositories/admin_user_repository'

export const DEFAULT_FEATURES = [
  'classes',
  'ai_generation_monthly',
  'ai_image_generation_monthly',
  'ai_svg_generation_monthly',
  'export_pdf',
  'export_docx',
  'export_pptx',
  'export_xlsx',
  'custom_atp',
  'custom_iktp',
]

export class AdminCatalogService {
  constructor(
    private readonly schools: SchoolRepository = schoolRepository,
    private readonly presets: CurriculumPresetRepository = curriculumPresetRepository,
    private readonly entitlements: PackageEntitlementRepository = packageEntitlementRepository,
    private readonly users: AdminUserRepository = adminUserRepository
  ) {}

  async listAcademicYears() {
    return AcademicYear.query().orderBy('name', 'desc')
  }

  async findAcademicYear(id: string | number) {
    return AcademicYear.find(id)
  }

  async findAcademicYearByName(name: string) {
    return AcademicYear.findBy('name', name)
  }

  async createAcademicYear(data: Record<string, any>) {
    return AcademicYear.create(data)
  }

  async updateAcademicYear(id: string | number, data: Record<string, any>) {
    const academicYear = await this.findAcademicYear(id)
    if (!academicYear) return null
    await academicYear.merge(data).save()
    return academicYear
  }

  async deleteAcademicYear(id: string | number) {
    const academicYear = await this.findAcademicYear(id)
    if (!academicYear) return false
    await academicYear.delete()
    return true
  }

  async listSchools() {
    return School.query().orderBy('name')
  }

  async findSchool(id: string | number) {
    return School.find(id)
  }

  async createSchool(data: Record<string, any>) {
    const duplicate = await this.schools.findDuplicateByNormalizedName(data.name)
    if (duplicate) return false
    await School.create(data)
    return true
  }

  async updateSchool(id: string | number, data: Record<string, any>) {
    const school = await this.findSchool(id)
    if (!school) return null
    await school.merge(data).save()
    return school
  }

  async deleteSchool(id: string | number) {
    const school = await this.findSchool(id)
    if (!school) return false
    await school.delete()
    return true
  }

  async listPackages() {
    return Package.query().orderBy('sort_order', 'asc')
  }

  async findPackage(id: string | number) {
    return Package.find(id)
  }

  async createPackage(data: Record<string, any>) {
    return Package.create({ ...data, features: data.features ?? [] })
  }

  async updatePackage(id: string | number, data: Record<string, any>) {
    const pkg = await this.findPackage(id)
    if (!pkg) return null
    await pkg.merge(data).save()
    return pkg
  }

  async deletePackage(id: string | number) {
    const pkg = await this.findPackage(id)
    if (!pkg) return false
    await pkg.delete()
    return true
  }

  async listCurriculumPresets(educationLevel: string, semester: number) {
    return this.presets.listForAdmin(educationLevel, semester)
  }

  async findCurriculumPresetByCode(code: string) {
    return CurriculumPreset.findBy('code', code)
  }

  async createCurriculumPreset(payload: Record<string, any>) {
    return CurriculumPreset.create({
      educationLevel: payload.educationLevel,
      curriculumVersion: payload.curriculumVersion,
      semester: payload.semester,
      weekNumber: payload.weekNumber ?? null,
      code: payload.code,
      themeTitle: payload.themeTitle,
      subthemeTitle: payload.subthemeTitle ?? null,
      phase: payload.phase,
      groupContext: payload.groupContext ?? null,
      data: {
        description: payload.description,
        dpl: payload.dpl,
        kbcValues: payload.kbcValues,
        loosePartsSuggestions: payload.loosePartsSuggestions,
      },
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? payload.weekNumber ?? 1,
    })
  }

  async updateCurriculumPreset(id: string | number, payload: Record<string, any>) {
    const preset = await CurriculumPreset.findOrFail(id)

    if (payload.educationLevel !== undefined) preset.educationLevel = payload.educationLevel
    if (payload.curriculumVersion !== undefined)
      preset.curriculumVersion = payload.curriculumVersion
    if (payload.semester !== undefined) preset.semester = payload.semester
    if (payload.weekNumber !== undefined) preset.weekNumber = payload.weekNumber
    if (payload.code !== undefined) preset.code = payload.code
    if (payload.themeTitle !== undefined) preset.themeTitle = payload.themeTitle
    if (payload.subthemeTitle !== undefined) preset.subthemeTitle = payload.subthemeTitle
    if (payload.phase !== undefined) preset.phase = payload.phase
    if (payload.groupContext !== undefined) preset.groupContext = payload.groupContext
    if (payload.isActive !== undefined) preset.isActive = payload.isActive
    if (payload.sortOrder !== undefined) preset.sortOrder = payload.sortOrder

    const existingData = preset.data || {}
    preset.data = {
      ...existingData,
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.dpl !== undefined ? { dpl: payload.dpl } : {}),
      ...(payload.kbcValues !== undefined ? { kbcValues: payload.kbcValues } : {}),
      ...(payload.loosePartsSuggestions !== undefined
        ? { loosePartsSuggestions: payload.loosePartsSuggestions }
        : {}),
    }

    await preset.save()
    return preset
  }

  async deleteCurriculumPreset(id: string | number) {
    const preset = await CurriculumPreset.findOrFail(id)
    await preset.delete()
  }

  async resetCurriculumPresets() {
    await this.presets.resetDefaults(MASTER_KBC_PRESETS)
  }

  async listEntitlements() {
    const packages = await this.entitlements.listWithEntitlements()
    return packages.map((pkg) => ({
      ...pkg.toJSON(),
      entitlements: DEFAULT_FEATURES.map((featureKey) => {
        const entitlement = pkg.entitlements.find((item) => item.featureKey === featureKey)
        return {
          featureKey,
          label: getFeatureLabel(featureKey),
          isEnabled: entitlement?.isEnabled ?? false,
          limitValue: entitlement?.limitValue ?? null,
        }
      }),
    }))
  }

  async updateEntitlement(packageId: string | number, payload: Record<string, any>) {
    const pkg = await this.findPackage(packageId)
    if (!pkg) return false

    await PackageEntitlement.updateOrCreate(
      { packageId: pkg.id, featureKey: payload.featureKey },
      {
        isEnabled: payload.isEnabled === true || payload.isEnabled === 'true',
        limitValue:
          payload.limitValue === '' || payload.limitValue === null
            ? null
            : Number(payload.limitValue),
      }
    )
    return true
  }

  async listUsers() {
    const { users, packages, schools } = await this.users.listForAdmin()
    return {
      users: users.map((user) => user.toJSON()),
      packages: packages.map((pkg) => pkg.toJSON()),
      schools: schools.map((school) => school.toJSON()),
    }
  }

  async updateUser(
    userId: string | number,
    currentUserId: number,
    data: Record<string, any>
  ): Promise<'not_found' | 'self' | 'updated'> {
    const user = await User.find(userId)
    if (!user) return 'not_found'
    if (user.id === currentUserId) return 'self'

    const previousPackageId = user.packageId
    user.merge(data)

    if (data.schoolId !== undefined) {
      const school = data.schoolId ? await School.find(data.schoolId) : null
      user.schoolName = school?.name ?? null
    }

    if (data.packageId !== undefined && data.packageId !== previousPackageId) {
      await this.users.reassignPackage(user)
    } else {
      await user.save()
    }

    return 'updated'
  }

  async deleteUser(
    userId: string | number,
    currentUserId: number
  ): Promise<'not_found' | 'self' | 'deleted'> {
    const user = await User.find(userId)
    if (!user) return 'not_found'
    if (user.id === currentUserId) return 'self'
    await user.delete()
    return 'deleted'
  }
}

export const adminCatalogService = new AdminCatalogService()
