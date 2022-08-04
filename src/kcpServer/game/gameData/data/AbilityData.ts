import Loader from '$/gameData/loader'
import AbilityDataGroup from '@/types/gameData/AbilityData'
import AbilityConfig from '@/types/gameData/BinOutput/ConfigAbility'

class AbilityDataLoader extends Loader {
  declare data: AbilityDataGroup

  constructor() {
    super('AbilityData')
  }

  async getData(): Promise<AbilityDataGroup> {
    return super.getData()
  }

  async getAbility(listGroup: string, listName: string, name: string): Promise<AbilityConfig> {
    return (await this.getAbilityList(listGroup, listName)).find(config => config?.Default?.AbilityName === name)
  }

  async getAbilityList(listGroup: string, listName: string): Promise<AbilityConfig[]> {
    return (await this.getData())?.[listGroup]?.[listName] || []
  }
}

let loader: AbilityDataLoader
export default (() => loader = loader || new AbilityDataLoader())()