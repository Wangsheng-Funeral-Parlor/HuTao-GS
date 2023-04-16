import Packet, { PacketContext, PacketInterface } from '#/packet'

export interface WindSeedType1Notify {
  payload?: string
}

// windy 3.6
class WindSeedType1Packet extends Packet implements PacketInterface {
  constructor() {
    super('WindSeedType1')
  }

  async sendNotify(context: PacketContext, buf: Buffer): Promise<void> {
    const notifyData: WindSeedType1Notify = {
      payload: buf.toString('base64')
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], buf: Buffer): Promise<void> {
    await super.broadcastNotify(contextList, buf)
  }
}

let packet: WindSeedType1Packet
export default (() => packet = packet || new WindSeedType1Packet())()