import Packet, { PacketInterface, PacketContext } from "#/packet"

export interface WindSeedType1Notify {
  payload: string
  configId?: number
}

class WindSeedType1Packet extends Packet implements PacketInterface {
  constructor() {
    super("WindSeedType1")
  }

  async sendNotify(context: PacketContext, buf: Buffer): Promise<void> {
    const notifyData: WindSeedType1Notify = {
      payload: buf.toString("base64"),
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: WindSeedType1Packet
export default (() => (packet = packet || new WindSeedType1Packet()))()
