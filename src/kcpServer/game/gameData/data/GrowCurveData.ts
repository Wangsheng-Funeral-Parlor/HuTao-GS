import Loader from '$/gameData/loader'
import { CurveExcelConfig } from '@/types/gameData/ExcelBinOutput/Common/CurveExcelConfig'
import GrowCurveDataGroup from '@/types/gameData/GrowCurveData'

class GrowCurveDataLoader extends Loader {
  declare data: GrowCurveDataGroup

  constructor() {
    super('GrowCurveData')
  }

  async getData(): Promise<GrowCurveDataGroup> {
    return super.getData()
  }

  async getGrowCurve(group: string): Promise<CurveExcelConfig[]> {
    return (await this.getData())?.[group] || []
  }
}

let loader: GrowCurveDataLoader
export default (() => loader = loader || new GrowCurveDataLoader())()