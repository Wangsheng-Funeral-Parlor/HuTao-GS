export interface TeamResonanceExcelConfig {
  TeamResonanceId: number
  TeamResonanceGroupId: number
  Level: number
  NameTextMapHash: number
  DescTextMapHash: number
  OpenConfig: string
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]

  FireAvatarCount?: number
  WaterAvatarCount?: number
  WindAvatarCount?: number
  ElectricAvatarCount?: number
  GrassAvatarCount?: number
  IceAvatarCount?: number
  RockAvatarCount?: number
  Cond?: string
}

type TeamResonanceExcelConfigList = TeamResonanceExcelConfig[]

export default TeamResonanceExcelConfigList