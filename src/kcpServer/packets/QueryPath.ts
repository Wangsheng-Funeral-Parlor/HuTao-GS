import Packet, { PacketInterface, PacketContext } from '#/packet'
import { QueryPathOptionTypeEnum, QueryPathStatusTypeEnum } from '@/types/enum/queryPath'
import { RetcodeEnum } from '@/types/enum/retcode'
import { VectorInterface } from '@/types/game/motion'

export interface QueryPathReq {
  queryType: QueryPathOptionTypeEnum
  queryId: number
  sceneId: number
  sourcePos: VectorInterface
  destinationPos: VectorInterface[]
  filter?: {
    typeId: number
    areaMask: number
  }
  destinationExtend?: VectorInterface
  sourceExtend?: VectorInterface
}

export interface QueryPathRsp {
  retcode: RetcodeEnum
  queryId: number
  queryStatus: QueryPathStatusTypeEnum
  corners: VectorInterface[]
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