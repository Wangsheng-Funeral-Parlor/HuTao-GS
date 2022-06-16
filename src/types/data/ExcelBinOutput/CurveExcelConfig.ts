export interface CurveExcelConfig {
  Level: number
  CurveInfos: {
    Type: string
    Arith: string
    Value: number
  }[]
}

type CurveExcelConfigList = CurveExcelConfig[]

export default CurveExcelConfigList