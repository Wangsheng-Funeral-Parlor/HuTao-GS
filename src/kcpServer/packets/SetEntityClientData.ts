import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { EntityClientData } from '@/types/game/entity'

export interface SetEntityClientDataNotify {
  entityId: number
  entityClientData: EntityClientData
}

class SetEntityClientDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetEntityClientData', {
      notifyWaitState: ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_READY,
      notifyStateMask: 0xF0FF,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: SetEntityClientDataNotify): Promise<void> {
    await this.broadcastNotify(context.player.currentScene.broadcastContextList, data)
  }

  async sendNotify(context: PacketContext, data: SetEntityClientDataNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: SetEntityClientDataNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: SetEntityClientDataPacket
export default (() => packet = packet || new SetEntityClientDataPacket())()