import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { ScenePlayerInfo } from '@/types/game/playerInfo'

export interface ScenePlayerInfoNotify {
  playerInfoList: ScenePlayerInfo[]
}

class ScenePlayerInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePlayerInfo')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, true)) return

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