import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface DoSetPlayerBornDataNotify { }

class DoSetPlayerBornDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('DoSetPlayerBornData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: DoSetPlayerBornDataNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: DoSetPlayerBornDataPacket
export default (() => packet = packet || new DoSetPlayerBornDataPacket())()