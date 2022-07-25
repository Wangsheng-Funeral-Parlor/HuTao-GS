import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PlayTeamEntityInfo } from '@/types/proto'

export interface SyncScenePlayTeamEntityNotify {
  sceneId: number
  entityInfoList: PlayTeamEntityInfo[]
}

class SyncScenePlayTeamEntityPacket extends Packet implements PacketInterface {
  constructor() {
    super('SyncScenePlayTeamEntity')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE, true)) return

    const { currentScene } = context.player

    const notifyData: SyncScenePlayTeamEntityNotify = {
      sceneId: currentScene.id,
      entityInfoList: []
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: SyncScenePlayTeamEntityPacket
export default (() => packet = packet || new SyncScenePlayTeamEntityPacket())()