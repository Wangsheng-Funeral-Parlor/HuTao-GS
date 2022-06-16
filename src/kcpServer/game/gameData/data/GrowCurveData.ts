import Loader from '$/gameData/loader'
import { CurveExcelConfig } from '@/types/data/ExcelBinOutput/CurveExcelConfig'
import GrowCurveDataGroup from '@/types/data/GrowCurveData'

class GrowCurveDataLoader extends Loader {
  declare data: GrowCurveDataGroup

  constructor() {
    super('GrowCurveData')
  }

  getGrowCurve(group: string): CurveExcelConfig[] {
    return this.data?.[group] || []
  }
}

let loader: GrowCurveDataLoader
export default (() => loader = loader || new GrowCurveDataLoader())()