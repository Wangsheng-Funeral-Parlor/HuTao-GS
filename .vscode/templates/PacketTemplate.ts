import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'

export interface {{name}}Req { }

export interface {{name}}Rsp {
  retcode: RetcodeEnum
}

export interface {{name}}Notify { }

class {{name}}Packet extends Packet implements PacketInterface {
  constructor() {
    super('{{name}}')
  }

  async request(context: PacketContext, data: {{name}}Req): Promise<void> {
    return
  }

  async response(context: PacketContext, data: {{name}}Rsp): Promise<void> {
    await super.response(context, data)
  }

  async recvNotify(context: PacketContext, data: {{name}}Notify): Promise<void> {
    return
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: {{name}}Notify = {}

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], ...data: any[]): Promise<void> {
    await super.broadcastNotify(contextList, ...data)
  }
}

let packet: {{name}}Packet
export default (() => packet = packet || new {{name}}Packet())()