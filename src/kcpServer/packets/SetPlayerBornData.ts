import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface SetPlayerBornDataReq {
  avatarId: number
  nickName: string
}

export interface SetPlayerBornDataRsp {
  retcode: RetcodeEnum
}

class SetPlayerBornDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetPlayerBornData', {
      reqState: ClientStateEnum.PICK_TWIN
    })
  }

  async request(context: PacketContext, data: SetPlayerBornDataReq): Promise<void> {
    const { game, player } = context

    await player.initNew(data.avatarId, data.nickName)
    await game.playerLogin(context)

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: SetPlayerBornDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerBornDataPacket
export default (() => packet = packet || new SetPlayerBornDataPacket())()