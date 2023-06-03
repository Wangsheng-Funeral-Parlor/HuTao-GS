export interface MonsterExcelConfig {
  MonsterName: string
  Type: string
  ScriptDataPathHashSuffix: number
  ScriptDataPathHashPre: number
  ServerScript: string
  CombatConfigHashSuffix: number
  CombatConfigHashPre: number
  Affix: number[]
  Ai: string
  Equips: number[]
  HpDrops: {
    DropId?: number
    HpPercent?: number
  }[]
  ExcludeWeathers: string
  FeatureTagGroupID: number
  MpPropID: number
  Skin: string
  HpBase: number
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
  ControllerPathRemoteHashPre: number
  CampID: number
  LODPatternName: string
  IsInvisibleReset?: boolean
  KillDropId?: number
  DescribeId?: number
  CombatBGMLevel?: number
  EntityBudgetLevel?: number
  AttackBase?: number
  DefenseBase?: number
  IceSubHurt?: number
  GrassSubHurt?: number
  WindSubHurt?: number
  ElecSubHurt?: number
  PhysicalSubHurt?: number
  SecurityLevel?: string
  IsAIHashCheck?: boolean
  SafetyCheck?: boolean
  VisionLevel?: string
}

type MonsterExcelConfigList = MonsterExcelConfig[]

export default MonsterExcelConfigList
