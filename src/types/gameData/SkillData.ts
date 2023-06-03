export interface SkillDepotData {
  Id: number
  Skills: number[]
  SubSkills: number[]
  ExtraAbilities: string[]
  Talents: number[]
  TalentStarName: string
  InherentProudSkillOpens: {
    ProudSkillGroupId?: number
    NeedAvatarPromoteLevel?: number
  }[]
  SkillDepotAbilityGroup: string

  EnergySkill?: number
  LeaderTalent?: number
  AttackModeSkill?: number
}

export interface SkillData {
  Id: number
  AbilityName: string
  MaxChargeNum: number
  GlobalValueKey: string

  CostStamina?: number
  CdTime?: number
  TriggerID?: number
  DragType?: string
  ProudSkillGroupId?: number
  ForceCanDoSkill?: boolean
  CostElemType?: string
  CostElemVal?: number
  IgnoreCDMinusRatio?: boolean
  IsRanged?: boolean
  NeedMonitor?: string
  DefaultLocked?: boolean
  NeedStore?: boolean
  CdSlot?: number
  EnergyMin?: number
}

export interface ProudSkillData {
  Id: number
  GroupId: number
  Level: number
  Type: number
  CostItems: {
    Id?: number
    Count?: number
  }[]
  FilterConds: string[]
  ParamDescList: number[]
  LifeEffectParams: string[]
  OpenConfig: string
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]

  BreakLevel?: number
  LifeEffectType?: string
  CoinCost?: number
  EffectiveForTeam?: number
}

export default interface SkillDataGroup {
  Depot: SkillDepotData[]
  Skill: SkillData[]
  ProudSkill: ProudSkillData[]
}
