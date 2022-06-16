import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'

export interface EvtAvatarSitDownNotify {
  entityId: number
  position: VectorInterface
  chairId: number
}

class EvtAvatarSitDownPacket extends Packet implements PacketInterface {
  constructor() {
    super('EvtAvatarSitDown', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: EvtAvatarSitDownNotify): Promise<void> {
    await this.broadcastNotify(context.player.currentScene.broadcastContextList, data)
  }

  async sendNotify(context: PacketContext, data: EvtAvatarSitDownNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: EvtAvatarSitDownNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: EvtAvatarSitDownPacket
export default (() => packet = packet || new EvtAvatarSitDownPacket())()