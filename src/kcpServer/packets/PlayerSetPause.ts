import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface PlayerSetPauseReq {
  isPaused: boolean
}

export interface PlayerSetPauseRsp {
  retcode: RetcodeEnum
}

class PlayerSetPausePacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerSetPause', {
      reqState: ClientStateEnum.ENTER_SCENE,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: PlayerSetPauseReq): Promise<void> {
    const { player } = context

    if (!player.isInMp()) {
      if (data.isPaused) player.pause()
      else player.unpause()
    }

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: PlayerSetPauseRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PlayerSetPausePacket
export default (() => packet = packet || new PlayerSetPausePacket())()