import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface PingReq {
  seq?: number
  clientTime: number
  scData?: string
  ueTime: number
  totalTickTime: number
}

export interface PingRsp {
  retcode: RetcodeEnum
  seq?: number
  clientTime: number
}

class PingPacket extends Packet implements PacketInterface {
  constructor() {
    super('Ping')
  }

  async request(context: PacketContext, data: PingReq): Promise<void> {
    const { clientTime } = data

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      clientTime
    })
  }

  async response(context: PacketContext, data: PingRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PingPacket
export default (() => packet = packet || new PingPacket())()