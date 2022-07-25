import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ClientReconnectReasonEnum, QuitReasonEnum, RetcodeEnum } from '@/types/proto/enum'

export interface BackMyWorldReq { }

export interface BackMyWorldRsp {
  retcode: RetcodeEnum
}

class BackMyWorldPacket extends Packet implements PacketInterface {
  constructor() {
    super('BackMyWorld', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: BackMyWorldReq): Promise<void> {
    const { player } = context
    const { currentWorld } = player

    if (!player.isInMp()) {
      await this.response(context, { retcode: RetcodeEnum.RET_MP_NOT_IN_MP_MODE })
      return
    }

    if (player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_SVR_ERROR })
      return
    }

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })

    await currentWorld.leave(context, QuitReasonEnum.BACK_TO_MY_WORLD, ClientReconnectReasonEnum.CLIENT_RECONNNECT_QUIT_MP)
  }

  async response(context: PacketContext, data: BackMyWorldRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: BackMyWorldPacket
export default (() => packet = packet || new BackMyWorldPacket())()