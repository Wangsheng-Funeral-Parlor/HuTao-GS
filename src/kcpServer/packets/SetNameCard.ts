import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface SetNameCardReq {
  nameCardId: number
}

export interface SetNameCardRsp {
  retcode: RetcodeEnum
  nameCardId?: number
}

class SetNameCardPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetNameCard', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetNameCardReq): Promise<void> {
    const { profile } = context.player
    const { nameCardId } = data

    if (!profile.unlockedNameCardIdList.includes(nameCardId)) {
      await this.response(context, { retcode: RetcodeEnum.RET_NAME_CARD_NOT_UNLOCKED })
      return
    }

    profile.nameCardId = nameCardId

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      nameCardId: profile.nameCardId
    })
  }

  async response(context: PacketContext, data: SetNameCardRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetNameCardPacket
export default (() => packet = packet || new SetNameCardPacket())()