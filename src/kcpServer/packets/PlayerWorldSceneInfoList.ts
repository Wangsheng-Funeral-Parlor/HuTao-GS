import Packet, { PacketInterface, PacketContext } from '#/packet'
import SceneData from '$/gameData/data/SceneData'
import { ClientState } from '@/types/enum/state'
import { PlayerWorldSceneInfo } from '@/types/game/scene'

export interface PlayerWorldSceneInfoListNotify {
  infoList: PlayerWorldSceneInfo[]
}

class PlayerWorldSceneInfoListPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerWorldSceneInfoList')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    const { currentWorld } = context.player

    const sceneDataList = await SceneData.getSceneList()
    const infoList: PlayerWorldSceneInfo[] = []

    for (let sceneData of sceneDataList) {
      const { Id, IsMainScene } = sceneData
      if (!IsMainScene) continue

      const info = (await currentWorld.getScene(Id, false))?.exportSceneInfo()
      if (info == null) continue

      infoList.push(info)
    }

    const notifyData: PlayerWorldSceneInfoListNotify = { infoList }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerWorldSceneInfoListPacket
export default (() => packet = packet || new PlayerWorldSceneInfoListPacket())()