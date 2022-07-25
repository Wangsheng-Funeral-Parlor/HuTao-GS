import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import PlayerGameTime from './PlayerGameTime'
import { ClientStateEnum } from '@/types/enum'

export interface ChangeGameTimeReq {
  gameTime: number
  isForceSet: boolean
  extraDays: number
}

export interface ChangeGameTimeRsp {
  retcode: RetcodeEnum
  curGameTime?: number
  extraDays?: number
}

class ChangeGameTimePacket extends Packet implements PacketInterface {
  constructor() {
    super('ChangeGameTime', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: ChangeGameTimeReq): Promise<void> {
    const { player } = context
    const { gameTime, extraDays } = data

    if (!player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_MP_NOT_IN_MY_WORLD })
      await PlayerGameTime.sendNotify(context)
      return
    }

    player.setGameTime(gameTime, extraDays || 0)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      curGameTime: player.curGameTime,
      extraDays: extraDays || 0
    })
  }

  async response(context: PacketContext, data: ChangeGameTimeRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ChangeGameTimePacket
export default (() => packet = packet || new ChangeGameTimePacket())()