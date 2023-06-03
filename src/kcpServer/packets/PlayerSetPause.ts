import PlayerGameTime from "./PlayerGameTime"
import SceneTime from "./SceneTime"

import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface PlayerSetPauseReq {
  isPaused: boolean
}

export interface PlayerSetPauseRsp {
  retcode: RetcodeEnum
}

class PlayerSetPausePacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerSetPause", {
      reqState: ClientStateEnum.ENTER_SCENE,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: PlayerSetPauseReq): Promise<void> {
    const { player } = context

    if (!player.isInMp()) {
      if (data.isPaused) player.pause()
      else player.unpause()
    }

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })

    await PlayerGameTime.sendNotify(context)
    await SceneTime.sendNotify(context)
  }

  async response(context: PacketContext, data: PlayerSetPauseRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PlayerSetPausePacket
export default (() => (packet = packet || new PlayerSetPausePacket()))()
