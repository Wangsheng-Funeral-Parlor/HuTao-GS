import Packet, { PacketContext, PacketInterface } from "#/packet"
import Player from "$/player"
import { PreEnterMpStateEnum } from "@/types/proto/enum"

export interface PlayerPreEnterMpNotify {
  uid: number
  state: PreEnterMpStateEnum
  nickname: string
}

class PlayerPreEnterMpPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerPreEnterMp")
  }

  async sendNotify(context: PacketContext, player: Player): Promise<void> {
    const { uid, profile } = player

    const notifyData: PlayerPreEnterMpNotify = {
      uid,
      state: PreEnterMpStateEnum.START,
      nickname: profile.nickname,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerPreEnterMpPacket
export default (() => (packet = packet || new PlayerPreEnterMpPacket()))()
