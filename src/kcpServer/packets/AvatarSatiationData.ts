import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { AvatarSatiationData } from "@/types/proto"

export interface AvatarSatiationDataNotify {
  satiationDataList: AvatarSatiationData[]
}

class AvatarSatiationDataPacket extends Packet implements PacketInterface {
  constructor() {
    super("AvatarSatiationData")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN, true)) return

    const notifyData: AvatarSatiationDataNotify = {
      satiationDataList: context.player.avatarList.map((a) => a.exportSatiationData()),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AvatarSatiationDataPacket
export default (() => (packet = packet || new AvatarSatiationDataPacket()))()
