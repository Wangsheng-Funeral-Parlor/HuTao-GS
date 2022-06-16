import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface ServerTimeNotify {
  serverTime: string
}

class ServerTimePacket extends Packet implements PacketInterface {
  constructor() {
    super('ServerTime')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: ServerTimeNotify = {
      serverTime: Date.now().toString()
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: ServerTimePacket
export default (() => packet = packet || new ServerTimePacket())()