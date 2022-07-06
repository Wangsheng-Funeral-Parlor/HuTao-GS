import Loader from '$/gameData/loader'
import WorldDataGroup, { WorldData, WorldLevelData } from '@/types/gameData/WorldData'

class WorldDataLoader extends Loader {
  declare data: WorldDataGroup

  constructor() {
    super('WorldData', [])
  }

  async getData(): Promise<WorldDataGroup> {
    return super.getData()
  }

  async getWorld(id: number): Promise<WorldData> {
    return (await this.getWorldList()).find(data => data.Id === id)
  }

  async getWorldList(): Promise<WorldData[]> {
    return (await this.getData())?.World || []
  }

  async getWorldLevel(level: number): Promise<WorldLevelData> {
    const worldLevelList = await this.getWorldLevelList()
    if (worldLevelList.length === 0) return null

    const maxLevel = Math.max(...worldLevelList.map(wl => wl.Level))
    if (level > maxLevel) return this.getWorldLevel(maxLevel)

    return worldLevelList.find(data => data.Level === level) || null
  }

  async getWorldLevelList(): Promise<WorldLevelData[]> {
    return (await this.getData())?.Level || []
  }
}

let loader: WorldDataLoader
export default (() => loader = loader || new WorldDataLoader())()