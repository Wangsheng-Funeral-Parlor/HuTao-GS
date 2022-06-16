import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'

export interface PlayerGameTimeNotify {
  gameTime: number
  uid: number
  isHome?: boolean
}

class PlayerGameTimePacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerGameTime')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN, true)) return

    const { player } = context
    const { uid, gameTime } = player.currentWorld?.host || player

    const notifyData: PlayerGameTimeNotify = {
      gameTime,
      uid
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: PlayerGameTimePacket
export default (() => packet = packet || new PlayerGameTimePacket())()