import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface GetShopmallDataReq { }

export interface GetShopmallDataRsp {
  retcode: RetcodeEnum
  shopTypeList: number[]
}

class GetShopmallDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('GetShopmallData')
  }

  async request(context: PacketContext, _data: GetShopmallDataReq): Promise<void> {
    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      shopTypeList: [
        900,
        1052,
        902,
        1001
      ]
    })
  }

  async response(context: PacketContext, data: GetShopmallDataRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GetShopmallDataPacket
export default (() => packet = packet || new GetShopmallDataPacket())()