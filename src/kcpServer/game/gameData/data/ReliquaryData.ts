import Loader from "$/gameData/loader"
import ReliquaryDataGroup, {
  ReliquaryAffixData,
  ReliquaryData,
  ReliquaryLevelData,
  ReliquaryMainPropData,
  ReliquarySetData,
} from "@/types/gameData/ReliquaryData"

class ReliquaryDataLoader extends Loader {
  declare data: ReliquaryDataGroup

  constructor() {
    super("ReliquaryData", "message.cache.debug.reliquary")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getReliquary(id: number): ReliquaryData {
    return this.getReliquaryList().find((data) => data.Id === id)
  }

  getReliquaryList(): ReliquaryData[] {
    return this.data?.Reliquary || []
  }

  getMainProp(id: number): ReliquaryMainPropData {
    return this.getMainPropList().find((data) => data.Id === id)
  }

  getMainPropsByDepot(depotId: number): ReliquaryMainPropData[] {
    return this.getMainPropList().filter((data) => data.PropDepotId === depotId)
  }

  getMainPropList(): ReliquaryMainPropData[] {
    return this.data?.MainProp || []
  }

  getAffix(id: number): ReliquaryAffixData {
    return this.getAffixList().find((data) => data.Id === id)
  }

  getAffixsByDepot(depotId: number): ReliquaryAffixData[] {
    return this.getAffixList().filter((data) => data.DepotId === depotId)
  }

  getAffixList(): ReliquaryAffixData[] {
    return this.data?.Affix || []
  }

  getLevel(level: number, rank: number): ReliquaryLevelData {
    return this.getLevelList().find((data) => data.Level === level && (data.Rank || 0) === rank)
  }

  getLevelList(): ReliquaryLevelData[] {
    return this.data?.Level || []
  }

  getSet(id: number): ReliquarySetData {
    return this.getSetList().find((data) => data.Id === id)
  }

  getSetList(): ReliquarySetData[] {
    return this.data?.Set || []
  }
}

let loader: ReliquaryDataLoader
export default (() => (loader = loader || new ReliquaryDataLoader()))()
