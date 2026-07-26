import vine from '@vinejs/vine'

export const updateUserRoleValidator = vine.create(
  vine.object({
    role: vine.enum(['admin', 'guru', 'kepala_sekolah']),
    packageId: vine.number().positive().nullable().optional(),
    schoolId: vine.number().positive().nullable().optional(),
  })
)

export const createSchoolValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    npsn: vine.string().trim().maxLength(20).optional(),
  })
)

export const updateSchoolValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    npsn: vine.string().trim().maxLength(20).nullable().optional(),
  })
)

export const createPackageValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
    displayName: vine.string().trim().minLength(1).maxLength(100),
    description: vine.string().trim().maxLength(300).optional(),
    priceMonthly: vine.number().min(0),
    priceYearly: vine.number().min(0).nullable().optional(),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().optional(),
  })
)

export const updatePackageValidator = vine.create(
  vine.object({
    displayName: vine.string().trim().minLength(1).maxLength(100).optional(),
    description: vine.string().trim().maxLength(300).optional(),
    priceMonthly: vine.number().min(0).optional(),
    priceYearly: vine.number().min(0).nullable().optional(),
    isActive: vine.boolean().optional(),
    sortOrder: vine.number().optional(),
  })
)

export const createAcademicYearValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(20),
    isActive: vine.boolean().optional(),
  })
)

export const updateAcademicYearValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(20).optional(),
    isActive: vine.boolean().optional(),
  })
)
