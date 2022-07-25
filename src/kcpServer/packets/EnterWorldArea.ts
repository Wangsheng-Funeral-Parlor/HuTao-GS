import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface EnterWorldAreaReq {
  areaType: number
  areaId: number
}

export interface EnterWorldAreaRsp {
  retcode: RetcodeEnum
  areaType: number
  areaId: number
}

class EnterWorldAreaPacket extends Packet implements PacketInterface {
  constructor() {
    super('EnterWorldArea')
  }

  async request(context: PacketContext, data: EnterWorldAreaReq): Promise<void> {
    const { areaType, areaId } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      areaType,
      areaId
    })
  }

  async response(context: PacketContext, data: EnterWorldAreaRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EnterWorldAreaPacket
export default (() => packet = packet || new EnterWorldAreaPacket())()