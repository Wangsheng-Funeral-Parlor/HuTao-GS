import Packet, { PacketContext, PacketInterface } from "#/packet"
import { AnnounceData } from "@/types/proto"

export interface ServerAnnounceNotify {
  announceDataList: AnnounceData[]
}

class ServerAnnouncePacket extends Packet implements PacketInterface {
  constructor() {
    super("ServerAnnounce")
  }

  async sendNotify(context: PacketContext, announceDataList: AnnounceData[]): Promise<void> {
    const notifyData: ServerAnnounceNotify = { announceDataList }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], announceDataList: AnnounceData[]): Promise<void> {
    await super.broadcastNotify(contextList, announceDataList)
  }
}

let packet: ServerAnnouncePacket
export default (() => (packet = packet || new ServerAnnouncePacket()))()
