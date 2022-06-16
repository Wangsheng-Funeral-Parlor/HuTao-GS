export interface ReliquarySetExcelConfig {
  SetId: number
  SetIcon: string
  SetNeedNum: number[]
  ContainsList: number[]
  EquipAffixId?: number
  DisableFilter?: number
}

type ReliquarySetExcelConfigList = ReliquarySetExcelConfig[]

export default ReliquarySetExcelConfigList