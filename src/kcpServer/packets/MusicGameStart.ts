import Packet, { PacketInterface, PacketContext } from "#/packet"
import { RetcodeEnum } from "@/types/proto/enum"

export interface MusicGameStartReq {
  musicBasicId?: number
  guid?: string
  flag?: boolean
}

export interface MusicGameStartRsp {
  retcode: RetcodeEnum
  musicBasicId?: number
  guid?: string
}

class MusicGameStartPacket extends Packet implements PacketInterface {
  constructor() {
    super("MusicGameStart")
  }

  async request(context: PacketContext, data: MusicGameStartReq): Promise<void> {
    const { musicBasicId, guid } = data

    if (musicBasicId != null) {
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        musicBasicId,
      })
    } else if (guid != null) {
      await this.response(context, {
        retcode: RetcodeEnum.RET_SUCC,
        guid,
      })
    }
  }

  async response(context: PacketContext, data: MusicGameStartRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: MusicGameStartPacket
export default (() => (packet = packet || new MusicGameStartPacket()))()
