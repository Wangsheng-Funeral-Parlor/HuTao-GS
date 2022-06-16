import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'

export interface DoSetPlayerBornDataNotify { }

class DoSetPlayerBornDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('DoSetPlayerBornData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN)) return

    const notifyData: DoSetPlayerBornDataNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: DoSetPlayerBornDataPacket
export default (() => packet = packet || new DoSetPlayerBornDataPacket())()