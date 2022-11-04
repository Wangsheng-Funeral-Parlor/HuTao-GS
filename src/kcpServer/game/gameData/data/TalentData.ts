import Loader from '$/gameData/loader'
import TalentDataList, { AvatarTalentData } from '@/types/gameData/TalentData'

class TalentDataLoader extends Loader {
  declare data: TalentDataList

  constructor() {
    super('TalentData')
  }

  async getData(): Promise<TalentDataList> {
    return super.getData()
  }

  async getAvatarTalent(id: number): Promise<AvatarTalentData> {
    return (await this.getAvatarTalentList()).find(data => data.Id === id)
  }

  async getAvatarTalentList(): Promise<AvatarTalentData[]> {
    return (await this.getData()).Avatar || []
  }
}

let loader: TalentDataLoader
export default (() => loader = loader || new TalentDataLoader())()