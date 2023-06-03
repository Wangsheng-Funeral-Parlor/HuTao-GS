import Loader from "$/gameData/loader"
import TalentDataList, { AvatarTalentData } from "@/types/gameData/TalentData"

class TalentDataLoader extends Loader {
  declare data: TalentDataList

  constructor() {
    super("TalentData", "message.cache.debug.talent")
  }

  async getData(): Promise<void> {
    await super.getData()
  }

  getAvatarTalent(id: number): AvatarTalentData {
    return this.getAvatarTalentList().find((data) => data.Id === id)
  }

  getAvatarTalentList(): AvatarTalentData[] {
    return this.data.Avatar || []
  }
}

let loader: TalentDataLoader
export default (() => (loader = loader || new TalentDataLoader()))()
