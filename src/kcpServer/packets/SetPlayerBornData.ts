import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

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
      reqState: ClientState.PICK_TWIN
    })
  }

  async request(context: PacketContext, data: SetPlayerBornDataReq): Promise<void> {
    const { game, player } = context

    await player.initNew(data.avatarId, data.nickName)

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
    await game.playerLogin(context)
  }

  async response(context: PacketContext, data: SetPlayerBornDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerBornDataPacket
export default (() => packet = packet || new SetPlayerBornDataPacket())()