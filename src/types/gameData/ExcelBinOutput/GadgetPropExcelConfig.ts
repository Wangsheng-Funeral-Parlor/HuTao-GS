export interface GadgetPropExcelConfig {
  Id: number
  Hp: number
  HpCurve: string
  AttackCurve: string
  DefenseCurve: string
  Attack?: number
  Defense?: number
}

type GadgetPropExcelConfigList = GadgetPropExcelConfig[]

export default GadgetPropExcelConfigList
