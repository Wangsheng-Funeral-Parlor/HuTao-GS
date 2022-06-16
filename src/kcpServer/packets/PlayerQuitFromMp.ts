import Packet, { PacketInterface, PacketContext } from '#/packet'
import { QuitReasonEnum } from '@/types/enum/mp'
import { ClientState } from '@/types/enum/state'

export interface PlayerQuitFromMpNotify {
  reason: QuitReasonEnum
}

class PlayerQuitFromMpPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerQuitFromMp')
  }

  async sendNotify(context: PacketContext, reason: QuitReasonEnum): Promise<void> {
    if (!this.checkState(context, ClientState.IN_GAME, true)) return

    const notifyData: PlayerQuitFromMpNotify = {
      reason
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerQuitFromMpPacket
export default (() => packet = packet || new PlayerQuitFromMpPacket())()