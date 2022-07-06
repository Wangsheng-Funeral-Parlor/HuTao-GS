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

  async getAbility(group: string, name: string): Promise<AbilityConfig[]> {
    return (await this.getData())?.[group]?.[name] || []
  }
}

let loader: AbilityDataLoader
export default (() => loader = loader || new AbilityDataLoader())()