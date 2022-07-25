import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { Birthday } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

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
      reqState: ClientStateEnum.POST_LOGIN,
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