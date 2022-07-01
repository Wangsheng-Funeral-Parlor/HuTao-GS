import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AbilityInvokeEntry } from '@/types/game/invoke'

export interface AbilityInvocationsNotify {
  invokes: AbilityInvokeEntry[]
}

class AbilityInvocationsPacket extends Packet implements PacketInterface {
  constructor() {
    super('AbilityInvocations', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: AbilityInvocationsNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer } = player
    const { invokes } = data

    for (let invokeEntry of invokes) forwardBuffer.addEntry(this, invokeEntry, seqId)
  }

  async sendNotify(context: PacketContext, data: AbilityInvocationsNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], invokes: AbilityInvokeEntry[]): Promise<void> {
    const notifyData: AbilityInvocationsNotify = { invokes }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: AbilityInvocationsPacket
export default (() => packet = packet || new AbilityInvocationsPacket())()