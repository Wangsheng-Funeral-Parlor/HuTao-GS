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

    const notifyData: PlayerWorldSceneInfoListNotify = {
      infoList: SceneData.getSceneList()
        .filter(scene => scene.IsMainScene)
        .map(scene => currentWorld.getScene(scene.Id)?.exportSceneInfo())
        .filter(info => info != null)
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerWorldSceneInfoListPacket
export default (() => packet = packet || new PlayerWorldSceneInfoListPacket())()