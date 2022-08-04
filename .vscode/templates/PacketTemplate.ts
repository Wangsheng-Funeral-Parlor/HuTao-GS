import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface PacketTemplateReq { }

export interface PacketTemplateRsp {
  retcode: RetcodeEnum
}

export interface PacketTemplateNotify { }

class PacketTemplatePacket extends Packet implements PacketInterface {
  constructor() {
    super('PacketTemplate')
  }

  async request(context: PacketContext, data: PacketTemplateReq): Promise<void> {
    return
  }

  async response(context: PacketContext, data: PacketTemplateRsp): Promise<void> {
    await super.response(context, data)
  }

  async recvNotify(context: PacketContext, data: PacketTemplateNotify): Promise<void> {
    return
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: PacketTemplateNotify = {}

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: PacketTemplatePacket
export default (() => packet = packet || new PacketTemplatePacket())()