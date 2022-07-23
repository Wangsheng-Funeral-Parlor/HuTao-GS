import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'

export interface GetAllUnlockNameCardReq { }

export interface GetAllUnlockNameCardRsp {
  retcode: RetcodeEnum
  nameCardList: number[]
}

class GetAllUnlockNameCardPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetAllUnlockNameCard', {
      reqWaitState: ClientState.POST_LOGIN,
      reqWaitStatePass: true
    })
  }

  async request(context: PacketContext, _data: GetAllUnlockNameCardReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      nameCardList: context.player.profile.unlockedNameCardIdList
    })
  }

  async response(context: PacketContext, data: GetAllUnlockNameCardRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetAllUnlockNameCardPacket
export default (() => packet = packet || new GetAllUnlockNameCardPacket())()