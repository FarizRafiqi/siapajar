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
import { packageRepository } from '#repositories/package_repository'
import type { PackageRepository } from '#repositories/package_repository'
import { auditService } from '#services/audit_service'

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
    private readonly users: AdminUserRepository = adminUserRepository,
    private readonly packages: PackageRepository = packageRepository
  ) {}

  async listAcademicYears() {
    return AcademicYear.query().orderBy('name', 'desc')
  }

  async findAcademicYear(id: string | number) {
    return AcademicYear.find(id)
  }

  async findAcademicYearByName(name: string, exceptId?: string | number) {
    const query = AcademicYear.query().where('name', name)
    if (exceptId !== undefined) query.whereNot('id', exceptId)
    return query.first()
  }

  async createAcademicYear(data: Record<string, any>, actorId?: number) {
    const academicYear = await AcademicYear.create(data)
    await auditService.recordCritical({
      actorId,
      action: 'admin.academic_year.created',
      entityType: 'academic_year',
      entityId: academicYear.id,
      metadata: { changedFields: Object.keys(data).sort() },
    })
    return academicYear
  }

  async updateAcademicYear(id: string | number, data: Record<string, any>, actorId?: number) {
    const academicYear = await this.findAcademicYear(id)
    if (!academicYear) return null
    await academicYear.merge(data).save()
    await auditService.recordCritical({
      actorId,
      action: 'admin.academic_year.updated',
      entityType: 'academic_year',
      entityId: academicYear.id,
      metadata: { changedFields: Object.keys(data).sort() },
    })
    return academicYear
  }

  async deleteAcademicYear(id: string | number, actorId?: number) {
    const academicYear = await this.findAcademicYear(id)
    if (!academicYear) return false
    await academicYear.delete()
    await auditService.recordCritical({
      actorId,
      action: 'admin.academic_year.deleted',
      entityType: 'academic_year',
      entityId: id,
      metadata: { deleted: true },
    })
    return true
  }

  async listSchools() {
    return this.schools.listForAdmin()
  }

  async findSchool(id: string | number) {
    return School.find(id)
  }

  async createSchool(data: Record<string, any>, actorId?: number) {
    const duplicate = await this.schools.findDuplicateByNormalizedName(data.name)
    if (duplicate) return false
    const school = await School.create(data)
    await auditService.recordCritical({
      actorId,
      action: 'admin.school.created',
      entityType: 'school',
      entityId: school.id,
      metadata: { changedFields: Object.keys(data).sort() },
    })
    return true
  }

  async updateSchool(id: string | number, data: Record<string, any>, actorId?: number) {
    const school = await this.findSchool(id)
    if (!school) return null
    if (data.name) {
      const duplicate = await this.schools.findDuplicateByNormalizedName(data.name, id)
      if (duplicate) return 'duplicate' as const
    }
    await school.merge(data).save()
    await auditService.recordCritical({
      actorId,
      action: 'admin.school.updated',
      entityType: 'school',
      entityId: school.id,
      metadata: { changedFields: Object.keys(data).sort() },
    })
    return school
  }

  async deleteSchool(id: string | number, actorId?: number) {
    const school = await this.findSchool(id)
    if (!school) return false
    await this.schools.deleteForAdmin(school)
    await auditService.recordCritical({
      actorId,
      action: 'admin.school.deleted',
      entityType: 'school',
      entityId: id,
      metadata: { deleted: true },
    })
    return true
  }

  async listPackages() {
    return this.packages.listForAdmin()
  }

  async findPackage(id: string | number) {
    return Package.find(id)
  }

  async findPackageByName(name: string) {
    return Package.findBy('name', name)
  }

  async createPackage(data: Record<string, any>, actorId?: number) {
    const pkg = await Package.create({ ...data, features: data.features ?? [] })
    await auditService.recordCritical({
      actorId,
      action: 'admin.package.created',
      entityType: 'package',
      entityId: pkg.id,
      metadata: packageAuditState(pkg),
    })
    return pkg
  }

  async updatePackage(id: string | number, data: Record<string, any>, actorId?: number) {
    const pkg = await this.findPackage(id)
    if (!pkg) return null
    const before = packageAuditState(pkg)
    await pkg.merge(data).save()
    await auditService.recordCritical({
      actorId,
      action: 'admin.package.updated',
      entityType: 'package',
      entityId: pkg.id,
      metadata: {
        changedFields: Object.keys(data).sort(),
        before,
        after: packageAuditState(pkg),
      },
    })
    return pkg
  }

  async deletePackage(id: string | number, actorId?: number) {
    const pkg = await this.findPackage(id)
    if (!pkg) return 'not_found' as const
    const users = await pkg.related('users').query().count('* as total')
    if (Number(users[0]?.$extras.total ?? 0) > 0) return 'in_use' as const
    const deletedPackage = packageAuditState(pkg)
    await pkg.delete()
    await auditService.recordCritical({
      actorId,
      action: 'admin.package.deleted',
      entityType: 'package',
      entityId: id,
      metadata: deletedPackage,
    })
    return 'deleted' as const
  }

  async listCurriculumPresets(educationLevel: string, semester: number) {
    return this.presets.listForAdmin(educationLevel, semester)
  }

  async findCurriculumPresetByCode(code: string, exceptId?: string | number) {
    return this.presets.findByCode(code, exceptId)
  }

  async createCurriculumPreset(payload: Record<string, any>, actorId?: number) {
    const preset = await CurriculumPreset.create({
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
    await auditService.recordCritical({
      actorId,
      action: 'admin.curriculum_preset.created',
      entityType: 'curriculum_preset',
      entityId: preset.id,
      metadata: {
        educationLevel: preset.educationLevel,
        semester: preset.semester,
        weekNumber: preset.weekNumber,
      },
    })
    return preset
  }

  async updateCurriculumPreset(
    id: string | number,
    payload: Record<string, any>,
    actorId?: number
  ) {
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
    await auditService.recordCritical({
      actorId,
      action: 'admin.curriculum_preset.updated',
      entityType: 'curriculum_preset',
      entityId: preset.id,
      metadata: { changedFields: Object.keys(payload).sort() },
    })
    return preset
  }

  async deleteCurriculumPreset(id: string | number, actorId?: number) {
    const preset = await CurriculumPreset.findOrFail(id)
    await preset.delete()
    await auditService.recordCritical({
      actorId,
      action: 'admin.curriculum_preset.deleted',
      entityType: 'curriculum_preset',
      entityId: id,
      metadata: { deleted: true },
    })
  }

  async resetCurriculumPresets(actorId?: number) {
    await this.presets.resetDefaults(MASTER_KBC_PRESETS)
    await auditService.recordCritical({
      actorId,
      action: 'admin.curriculum_presets.reset_defaults',
      entityType: 'curriculum_preset_catalog',
      metadata: { templateCount: MASTER_KBC_PRESETS.length },
    })
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

  async updateEntitlement(
    packageId: string | number,
    payload: Record<string, any>,
    actorId?: number
  ) {
    const pkg = await this.findPackage(packageId)
    if (!pkg) return false

    const previous = await this.entitlements.findForFeature(pkg.id, payload.featureKey)
    const nextIsEnabled = payload.isEnabled === true || payload.isEnabled === 'true'
    const nextLimitValue =
      payload.limitValue === '' || payload.limitValue === null ? null : Number(payload.limitValue)
    await PackageEntitlement.updateOrCreate(
      { packageId: pkg.id, featureKey: payload.featureKey },
      {
        isEnabled: nextIsEnabled,
        limitValue: nextLimitValue,
      }
    )
    await auditService.recordCritical({
      actorId,
      action: 'admin.package.entitlement.updated',
      entityType: 'package_entitlement',
      entityId: `${pkg.id}:${payload.featureKey}`,
      metadata: {
        packageId: pkg.id,
        featureKey: payload.featureKey,
        before: {
          isEnabled: previous?.isEnabled ?? false,
          limitValue: previous?.limitValue ?? null,
        },
        after: { isEnabled: nextIsEnabled, limitValue: nextLimitValue },
      },
    })
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

    const before = userAuditState(user)
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

    await auditService.recordCritical({
      actorId: currentUserId,
      action: 'admin.user.updated',
      entityType: 'user',
      entityId: user.id,
      metadata: {
        changedFields: Object.keys(data).filter(isAuditedUserField).sort(),
        before,
        after: userAuditState(user),
      },
    })

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
    await auditService.recordCritical({
      actorId: currentUserId,
      action: 'admin.user.deleted',
      entityType: 'user',
      entityId: user.id,
      metadata: { deleted: true },
    })
    return 'deleted'
  }
}

export const adminCatalogService = new AdminCatalogService()

function packageAuditState(pkg: Package) {
  const features = Array.isArray(pkg.features) ? pkg.features : []
  return {
    name: pkg.name,
    priceMonthly: pkg.priceMonthly,
    priceYearly: pkg.priceYearly,
    isActive: pkg.isActive,
    isHighlighted: pkg.isHighlighted,
    featureCount: features.length,
    creditEntitlements: features
      .filter(
        (feature): feature is string => typeof feature === 'string' && /\bkredit\b/i.test(feature)
      )
      .slice(0, 10),
  }
}

function isAuditedUserField(field: string) {
  return [
    'role',
    'packageId',
    'schoolId',
    'schoolName',
    'educationLevel',
    'institutionType',
  ].includes(field)
}

function userAuditState(user: User) {
  return {
    role: user.role,
    packageId: user.packageId,
    schoolId: user.schoolId,
    educationLevel: user.educationLevel,
    institutionType: user.institutionType,
  }
}
