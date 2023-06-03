import Loader from "$/gameData/loader"
import { CurveExcelConfig } from "@/types/gameData/ExcelBinOutput/Common/CurveExcelConfig"
import GrowCurveDataGroup from "@/types/gameData/GrowCurveData"

class GrowCurveDataLoader extends Loader {
  declare data: GrowCurveDataGroup

  constructor() {
    super("GrowCurveData", "message.cache.debug.growCurve")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getGrowCurve(group: string): CurveExcelConfig[] {
    return this.data?.[group] || []
  }
}

let loader: GrowCurveDataLoader
export default (() => (loader = loader || new GrowCurveDataLoader()))()
