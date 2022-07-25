import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface SetOpenStateReq {
  key: number
  value: number
}

export interface SetOpenStateRsp {
  retcode: RetcodeEnum
  key: number
  value: number
}

class SetOpenStatePacket extends Packet implements PacketInterface {
  constructor() {
    super('SetOpenState')
  }

  async request(context: PacketContext, data: SetOpenStateReq): Promise<void> {
    const { openState } = context.player
    const { key, value } = data

    await openState.set(key, value, true)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      key,
      value
    })
  }

  async response(context: PacketContext, data: SetOpenStateRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetOpenStatePacket
export default (() => packet = packet || new SetOpenStatePacket())()