export interface AvatarExcelConfig {
  UseType?: string
  BodyType: string
  ScriptDataPathHashSuffix: number
  ScriptDataPathHashPre: number
  IconName: string
  SideIconName: string
  QualityType: string
  ChargeEfficiency: number
  CombatConfigHashSuffix: number
  CombatConfigHashPre: number
  IsRangeAttack?: boolean
  InitialWeapon: number
  WeaponType: string
  ManekinPathHashSuffix: number
  ManekinPathHashPre: number
  ImageName: string
  GachaCardNameHashSuffix?: number
  GachaImageNameHashSuffix?: number
  ControllerPathRemoteHashPre: number
  CoopPicNameHashSuffix?: number
  StaminaRecoverSpeed: number
  CutsceneShow: string
  SkillDepotId: number
  CandSkillDepotIds: number[]
  ManekinJsonConfigHashSuffix: number
  ManekinJsonConfigHashPre: number
  ManekinMotionConfig: number
  DescTextMapHash: number
  AvatarIdentityType?: string
  AvatarPromoteId: number
  AvatarPromoteRewardLevelList: number[]
  AvatarPromoteRewardIdList: number[]
  FeatureTagGroupID: number
  InfoDescTextMapHash: number
  HpBase: number
  AttackBase: number
  DefenseBase: number
  Critical: number
  CriticalHurt: number
  PropGrowCurves: {
    Type: string
    GrowCurve: string
  }[]
  PrefabPathRagdollHashSuffix: number
  PrefabPathRagdollHashPre: number
  Id: number
  NameTextMapHash: number
  PrefabPathHashSuffix: number
  PrefabPathHashPre: number
  PrefabPathRemoteHashSuffix: number
  PrefabPathRemoteHashPre: number
  ControllerPathHashSuffix: number
  ControllerPathHashPre: number
  ControllerPathRemoteHashSuffix: number
  LODPatternName: string
}

type AvatarExcelConfigList = AvatarExcelConfig[]

export default AvatarExcelConfigList
