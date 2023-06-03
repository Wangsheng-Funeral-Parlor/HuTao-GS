import Loader from "$/gameData/loader"
import DungeonDataGroup, { DungeonChallengeData, DungeonData } from "@/types/gameData/DungeonData"

class DungeonDataLoader extends Loader {
  declare data: DungeonDataGroup

  constructor() {
    super("DungeonData", "message.cache.debug.dungeon")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getDungeon(id: number): DungeonData {
    return this.getDungeonList().find((data) => data.Id === id)
  }

  getDungeonByScene(sceneId: number): DungeonData {
    return this.getDungeonList().find((data) => data.SceneId === sceneId)
  }

  getDungeonList(): DungeonData[] {
    return this.data?.Dungeon || []
  }

  getDungeonChallenge(id: number): DungeonChallengeData {
    return this.getDungeonChallengeList().find((data) => data.Id === id)
  }
  getDungeonChallengeList(): DungeonChallengeData[] {
    return this.data?.Challenge || []
  }
}

let loader: DungeonDataLoader
export default (() => (loader = loader || new DungeonDataLoader()))()
