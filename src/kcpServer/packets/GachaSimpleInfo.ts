import Packet, { PacketInterface, PacketContext } from "#/packet"

export interface GachaSimpleInfoNotify {
  isNew?: boolean
}

class GachaSimpleInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("GachaSimpleInfo")
  }

  async sendNotify(context: PacketContext, isNew?: boolean): Promise<void> {
    const notifyData: GachaSimpleInfoNotify = { isNew: !!isNew }

    await super.sendNotify(context, notifyData)
  }
}

let packet: GachaSimpleInfoPacket
export default (() => (packet = packet || new GachaSimpleInfoPacket()))()
