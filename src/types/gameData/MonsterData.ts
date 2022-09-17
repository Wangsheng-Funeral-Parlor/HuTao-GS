import ConfigMonster from "./BinOutput/Config/ConfigMonster"

export interface MonsterData {
  Name: string
  Type: string
  ServerScript: string
  Ai: string
  ExcludeWeathers: string

  Id: number
  CampID: number
  MpPropID: number

  Affix: number[]
  Equips: number[]
  HpDrops: {
    DropId?: number
    HpPercent?: number
  }[]
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

  Config: ConfigMonster

  IsInvisibleReset: boolean
  IsAIHashCheck: boolean
  SafetyCheck: boolean

  HpBase: number
  AttackBase?: number
  DefenseBase?: number
  IceSubHurt?: number
  GrassSubHurt?: number
  WindSubHurt?: number
  ElecSubHurt?: number
  PhysicalSubHurt?: number

  KillDropId?: number
  DescribeId?: number
  EntityBudgetLevel?: number
  SecurityLevel?: string
  VisionLevel?: string
}

export interface MonsterAffixData {
  Id: number
  Affix: string
  Comment: string
  AbilityName: string[]
  IsLegal: boolean
  IsCommon: boolean
  PreAdd: boolean
}

export interface MonsterDescribeData {
  Id: number
  TitleID: number
  SpecialNameLabID: number
}

export interface MonsterMultiPlayerData {
  Id: number
  PropPer: {
    PropType: string
    PropValue: number[]
  }[]
  EndureNum: number[]
  ElementShield: number[]
}

export interface MonsterSpecialNameData {
  Id: number
  LabId: number
  IsInRandomList: boolean
}

export default interface MonsterDataGroup {
  Monster: MonsterData[]
  Affix: MonsterAffixData[]
  Describe: MonsterDescribeData[]
  MultiPlayer: MonsterMultiPlayerData[]
  SpecialName: MonsterSpecialNameData[]
}