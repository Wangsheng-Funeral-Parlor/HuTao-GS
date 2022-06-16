import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface OpenStateChangeNotify {
  openStateMap: { [key: number]: number }
}

class OpenStateChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('OpenStateChange')
  }

  async sendNotify(context: PacketContext, openStateMap: { [key: number]: number }): Promise<void> {
    const notifyData: OpenStateChangeNotify = {
      openStateMap
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: OpenStateChangePacket
export default (() => packet = packet || new OpenStateChangePacket())()