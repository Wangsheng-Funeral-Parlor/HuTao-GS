import Loader from "$/gameData/loader"
import WorldDataGroup, { WorldData, WorldLevelData } from "@/types/gameData/WorldData"

class WorldDataLoader extends Loader {
  declare data: WorldDataGroup

  constructor() {
    super("WorldData", "message.cache.debug.world", [])
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getWorld(id: number): WorldData {
    return this.getWorldList().find((data) => data.Id === id)
  }

  getWorldList(): WorldData[] {
    return this.data?.World || []
  }

  getWorldLevel(level: number): WorldLevelData {
    const worldLevelList = this.getWorldLevelList()
    if (worldLevelList.length === 0) return null

    const maxLevel = Math.max(...worldLevelList.map((wl) => wl.Level))
    if (level > maxLevel) return this.getWorldLevel(maxLevel)

    return worldLevelList.find((data) => data.Level === level) || null
  }

  getWorldLevelList(): WorldLevelData[] {
    return this.data?.Level || []
  }
}

let loader: WorldDataLoader
export default (() => (loader = loader || new WorldDataLoader()))()
