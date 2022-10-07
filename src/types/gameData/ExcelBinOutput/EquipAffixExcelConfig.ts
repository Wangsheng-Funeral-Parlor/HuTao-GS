export interface EquipAffixExcelConfig {
  AffixId: number
  Id: number
  NameTextMapHash: number
  DescTextMapHash: number
  OpenConfig: string
  AddProps: {
    PropType?: string
    Value?: number
  }[]
  ParamList: number[]

  Level?: number
}

type EquipAffixExcelConfigList = EquipAffixExcelConfig[]

export default EquipAffixExcelConfigList