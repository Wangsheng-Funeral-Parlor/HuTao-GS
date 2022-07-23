import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { Birthday } from '@/types/game/profile'

export interface SetPlayerBirthdayReq {
  birthday: Birthday
}

export interface SetPlayerBirthdayRsp {
  retcode: RetcodeEnum
  birthday: Birthday
}

class SetPlayerBirthdayPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetPlayerBirthday', {
      reqState: ClientState.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetPlayerBirthdayReq): Promise<void> {
    const { profile } = context.player
    const { birthday } = data
    const { month, day } = birthday

    profile.birthday = { month, day }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      birthday: profile.birthday
    })
  }

  async response(context: PacketContext, data: SetPlayerBirthdayRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerBirthdayPacket
export default (() => packet = packet || new SetPlayerBirthdayPacket())()