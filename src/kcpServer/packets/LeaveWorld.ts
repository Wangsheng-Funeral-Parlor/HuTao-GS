import Packet, { PacketInterface, PacketContext } from "#/packet"

export interface LeaveWorldNotify {}

class LeaveWorldPacket extends Packet implements PacketInterface {
  constructor() {
    super("LeaveWorld")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: LeaveWorldNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: LeaveWorldPacket
export default (() => (packet = packet || new LeaveWorldPacket()))()
