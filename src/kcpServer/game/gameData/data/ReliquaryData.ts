import Loader from '$/gameData/loader'
import ReliquaryDataGroup, { ReliquaryAffixData, ReliquaryData, ReliquaryMainPropData } from '@/types/data/ReliquaryData'

class ReliquaryDataLoader extends Loader {
  declare data: ReliquaryDataGroup

  constructor() {
    super('ReliquaryData')
  }

  get(id: number): ReliquaryData {
    return this.getList().find(data => data.Id === id)
  }

  getList(): ReliquaryData[] {
    return this.data?.Reliquary || []
  }

  getMainProp(id: number): ReliquaryMainPropData {
    return this.getMainPropList().find(data => data.Id === id)
  }

  getMainPropsByDepot(depotId: number): ReliquaryMainPropData[] {
    return this.getMainPropList().filter(data => data.PropDepotId === depotId)
  }

  getMainPropList(): ReliquaryMainPropData[] {
    return this.data?.MainProp || []
  }

  getAffix(id: number): ReliquaryAffixData {
    return this.getAffixList().find(data => data.Id === id)
  }

  getAffixsByDepot(depotId: number): ReliquaryAffixData[] {
    return this.getAffixList().filter(data => data.DepotId === depotId)
  }

  getAffixList(): ReliquaryAffixData[] {
    return this.data?.Affix || []
  }
}

let loader: ReliquaryDataLoader
export default (() => loader = loader || new ReliquaryDataLoader())()