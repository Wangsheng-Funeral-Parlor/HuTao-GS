import PlayerGameTime from "./PlayerGameTime"

import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SkipPlayerGameTimeReq {
  clientGameTime: number
  isForceSet: boolean
  gameTime: number
}

export interface SkipPlayerGameTimeRsp {
  retcode: RetcodeEnum
  clientGameTime?: number
  gameTime?: number
}

class SkipPlayerGameTimePacket extends Packet implements PacketInterface {
  constructor() {
    super("SkipPlayerGameTime", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SkipPlayerGameTimeReq): Promise<void> {
    const { player } = context
    const { gameTime, clientGameTime } = data

    if (!player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_MP_NOT_IN_MY_WORLD })
      await PlayerGameTime.sendNotify(context)
      return
    }

    context.player.gameTime = gameTime
    PlayerGameTime.sendNotify(context)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      gameTime: gameTime,
      clientGameTime: clientGameTime || 0,
    })
  }

  async response(context: PacketContext, data: SkipPlayerGameTimeRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SkipPlayerGameTimePacket
export default (() => (packet = packet || new SkipPlayerGameTimePacket()))()
