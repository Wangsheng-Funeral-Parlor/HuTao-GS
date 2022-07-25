import Packet, { PacketContext, PacketInterface } from '#/packet'
import { VectorInfo } from '@/types/proto'
import { QueryPathOptionTypeEnum, QueryPathStatusTypeEnum, RetcodeEnum } from '@/types/proto/enum'

export interface QueryPathReq {
  queryType: QueryPathOptionTypeEnum
  queryId: number
  sceneId: number
  sourcePos: VectorInfo
  destinationPos: VectorInfo[]
  filter?: {
    typeId: number
    areaMask: number
  }
  destinationExtend?: VectorInfo
  sourceExtend?: VectorInfo
}

export interface QueryPathRsp {
  retcode: RetcodeEnum
  queryId: number
  queryStatus: QueryPathStatusTypeEnum
  corners: VectorInfo[]
}

class QueryPathPacket extends Packet implements PacketInterface {
  constructor() {
    super('QueryPath')
  }

  async request(context: PacketContext, data: QueryPathReq): Promise<void> {
    const { queryId, sourcePos, destinationPos } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      queryId,
      queryStatus: QueryPathStatusTypeEnum.STATUS_SUCC,
      corners: [
        sourcePos,
        destinationPos[0] || sourcePos
      ]
    })
  }

  async response(context: PacketContext, data: QueryPathRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: QueryPathPacket
export default (() => packet = packet || new QueryPathPacket())()