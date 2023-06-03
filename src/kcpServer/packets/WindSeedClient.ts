import Packet, { PacketContext, PacketInterface } from "#/packet"
import { AddWindBulletNotify, AreaNotify, RefreshNotify } from "@/types/proto"

export interface WindSeedClientNotify {
  refreshNotify?: RefreshNotify
  addWindBulletNotify?: AddWindBulletNotify
  areaNotify?: AreaNotify
}

class WindSeedClientPacket extends Packet implements PacketInterface {
  constructor() {
    super("WindSeedClient")
  }

  async sendNotify(context: PacketContext, buf: Buffer): Promise<void> {
    const notifyData: WindSeedClientNotify = {
      areaNotify: {
        areaId: 1,
        areaCode: buf.toString("base64"),
        areaType: 1,
      },
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], buf: Buffer): Promise<void> {
    await super.broadcastNotify(contextList, buf)
  }
}

let packet: WindSeedClientPacket
export default (() => (packet = packet || new WindSeedClientPacket()))()
