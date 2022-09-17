import ConfigAvatar from './BinOutput/Config/ConfigAvatar'
import FetterDataList from './FetterData'

export interface AvatarData {
  UseType: string
  BodyType: string
  QualityType: string
  WeaponType: string

  Id: number
  Name: string
  IsRangeAttack: boolean
  InitialWeapon: number
  GachaCardNameHashSuffix: number
  GachaImageNameHashSuffix: number
  SkillDepotId: number
  CandSkillDepotIds: number[]

  AvatarPromoteId: number
  AvatarPromoteRewardLevelList: number[]
  AvatarPromoteRewardIdList: number[]

  HpBase: number
  AttackBase: number
  DefenseBase: number
  Critical: number
  CriticalHurt: number
  StaminaRecoverSpeed: number
  ChargeEfficiency: number

  PropGrowCurves: {
    Type: string
    GrowCurve: string
  }[]
  CombatConfigHashSuffix: number
  CombatConfigHashPre: number
  PrefabPathHashSuffix: number
  PrefabPathHashPre: number
  PrefabPathRemoteHashSuffix: number
  PrefabPathRemoteHashPre: number
  ControllerPathHashSuffix: number
  ControllerPathHashPre: number
  ControllerPathRemoteHashSuffix: number
  ControllerPathRemoteHashPre: number

  Config: ConfigAvatar
  Fetters: FetterDataList
}

export interface CostumeData {
  Id: number
  AvatarId: number
}

export interface FlycloakData {
  Id: number
}

export default interface AvatarDataGroup {
  Avatar: AvatarData[]
  Costume: CostumeData[]
  Flycloak: FlycloakData[]
}