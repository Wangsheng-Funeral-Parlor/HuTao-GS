import FetterConfig from './Common/FetterConfig'

export interface FetterInfoExcelConfig extends FetterConfig {
  InfoBirthMonth: number
  InfoBirthDay: number
  AvatarNativeTextMapHash: number
  AvatarVisionBeforTextMapHash: number
  AvatarConstellationBeforTextMapHash: number
  AvatarTitleTextMapHash: number
  AvatarDetailTextMapHash: number
  AvatarAssocType: string
  CvChineseTextMapHash: number
  CvJapaneseTextMapHash: number
  CvEnglishTextMapHash: number
  CvKoreanTextMapHash: number
  AvatarVisionAfterTextMapHash: number
  AvatarConstellationAfterTextMapHash: number
}

type FetterInfoExcelConfigList = FetterInfoExcelConfig[]

export default FetterInfoExcelConfigList