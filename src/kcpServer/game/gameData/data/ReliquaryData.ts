import Loader from '$/gameData/loader'
import ReliquaryDataGroup, { ReliquaryAffixData, ReliquaryData, ReliquaryMainPropData } from '@/types/gameData/ReliquaryData'

class ReliquaryDataLoader extends Loader {
  declare data: ReliquaryDataGroup

  constructor() {
    super('ReliquaryData')
  }

  async getData(): Promise<ReliquaryDataGroup> {
    return super.getData()
  }

  async getReliquary(id: number): Promise<ReliquaryData> {
    return (await this.getReliquaryList()).find(data => data.Id === id)
  }

  async getReliquaryList(): Promise<ReliquaryData[]> {
    return (await this.getData())?.Reliquary || []
  }

  async getMainProp(id: number): Promise<ReliquaryMainPropData> {
    return (await this.getMainPropList()).find(data => data.Id === id)
  }

  async getMainPropsByDepot(depotId: number): Promise<ReliquaryMainPropData[]> {
    return (await this.getMainPropList()).filter(data => data.PropDepotId === depotId)
  }

  async getMainPropList(): Promise<ReliquaryMainPropData[]> {
    return (await this.getData())?.MainProp || []
  }

  async getAffix(id: number): Promise<ReliquaryAffixData> {
    return (await this.getAffixList()).find(data => data.Id === id)
  }

  async getAffixsByDepot(depotId: number): Promise<ReliquaryAffixData[]> {
    return (await this.getAffixList()).filter(data => data.DepotId === depotId)
  }

  async getAffixList(): Promise<ReliquaryAffixData[]> {
    return (await this.getData())?.Affix || []
  }
}

let loader: ReliquaryDataLoader
export default (() => loader = loader || new ReliquaryDataLoader())()