import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ScenePlayerInfo } from '@/types/proto'

export interface ScenePlayerInfoNotify {
  playerInfoList: ScenePlayerInfo[]
}

class ScenePlayerInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePlayerInfo')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, true)) return

    const notifyData: ScenePlayerInfoNotify = {
      playerInfoList: context.player.currentScene.exportScenePlayerInfoList()
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: ScenePlayerInfoPacket
export default (() => packet = packet || new ScenePlayerInfoPacket())()