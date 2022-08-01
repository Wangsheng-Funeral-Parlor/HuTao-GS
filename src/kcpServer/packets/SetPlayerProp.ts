import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PropValue } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface SetPlayerPropReq {
  propList: PropValue[]
}

export interface SetPlayerPropRsp {
  retcode: RetcodeEnum
}

class SetPlayerPropPacket extends Packet implements PacketInterface {
  constructor() {
    super('SetPlayerProp', {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SetPlayerPropReq): Promise<void> {
    const { props } = context.player
    const { propList } = data
    if (!propList) return

    for (const prop of propList) props.set(prop.type, prop.ival != null ? prop.ival : prop.fval)

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: SetPlayerPropRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetPlayerPropPacket
export default (() => packet = packet || new SetPlayerPropPacket())()