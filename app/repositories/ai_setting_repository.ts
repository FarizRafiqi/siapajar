import AiSetting from '#models/ai_setting'

export class AiSettingRepository {
  async current() {
    let setting = await AiSetting.query().orderBy('id', 'asc').first()
    setting ??= await AiSetting.create({ provider: '9router', authMode: 'api_key' })
    return setting
  }
}

export const aiSettingRepository = new AiSettingRepository()
