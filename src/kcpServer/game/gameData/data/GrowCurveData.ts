import Loader from '$/gameData/loader'
import { CurveExcelConfig } from '@/types/gameData/ExcelBinOutput/CurveExcelConfig'
import GrowCurveDataGroup from '@/types/gameData/GrowCurveData'

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