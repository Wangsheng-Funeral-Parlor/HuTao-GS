export interface ProudSkillExcelConfig {
  ProudSkillId: number
  ProudSkillGroupId: number
  Level: number
  ProudSkillType: number
  NameTextMapHash: number
  DescTextMapHash: number
  UnlockDescTextMapHash: number
  Icon: string
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

type ProudSkillExcelConfigList = ProudSkillExcelConfig[]

export default ProudSkillExcelConfigList
