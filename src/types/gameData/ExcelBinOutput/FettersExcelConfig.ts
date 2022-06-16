import FetterConfig from './Common/FetterConfig'

export interface FettersExcelConfig extends FetterConfig {
  IsHiden: number
  Tips: number[]
  VoiceTitleTextMapHash: number
  VoiceFile: string
  VoiceFileTextTextMapHash: number
  VoiceTitleLockedTextMapHash: number
}

type FettersExcelConfigList = FettersExcelConfig[]

export default FettersExcelConfigList