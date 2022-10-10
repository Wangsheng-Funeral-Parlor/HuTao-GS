import ConfigTalent from './BinOutput/Config/ConfigTalent'

export interface AvatarTalentData {
  Id: number
  Name: string
  MainCostItemId: number
  MainCostItemCount: number
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]
  Config: ConfigTalent[]

  PrevTalent?: number
}

export interface EquipTalentData {
  AffixId: number
  Id: number
  Name: string
  NameTextMapHash: number
  DescTextMapHash: number
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]
  Config: ConfigTalent[]

  Level?: number
}

export interface TeamTalentData {
  TeamResonanceId: number
  TeamResonanceGroupId: number
  Name: string
  Level: number
  NameTextMapHash: number
  DescTextMapHash: number
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]
  Config: ConfigTalent[]

  FireAvatarCount?: number
  WaterAvatarCount?: number
  WindAvatarCount?: number
  ElectricAvatarCount?: number
  GrassAvatarCount?: number
  IceAvatarCount?: number
  RockAvatarCount?: number
  Cond?: string
}

export default interface TalentDataGroup {
  Avatar: AvatarTalentData[]
  Equip: EquipTalentData[]
  Team: TeamTalentData[]
}