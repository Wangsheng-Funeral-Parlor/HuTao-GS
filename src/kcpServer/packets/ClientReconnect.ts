import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientReconnectReasonEnum } from '@/types/proto/enum'

export interface ClientReconnectNotify {
  reason: ClientReconnectReasonEnum
}

class ClientReconnectPacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientReconnect')
  }

  async sendNotify(context: PacketContext, reason: ClientReconnectReasonEnum = ClientReconnectReasonEnum.CLIENT_RECONNNECT_NONE): Promise<void> {
    const notifyData: ClientReconnectNotify = { reason }

    await super.sendNotify(context, notifyData)
  }
}

let packet: ClientReconnectPacket
export default (() => packet = packet || new ClientReconnectPacket())()