import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { CombatInvokeEntry } from '@/types/game/invoke'

export interface CombatInvocationsNotify {
  invokeList: CombatInvokeEntry[]
}

class CombatInvocationsPacket extends Packet implements PacketInterface {
  constructor() {
    super('CombatInvocations', {
      notifyState: ClientState.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: CombatInvocationsNotify): Promise<void> {
    const { player, seqId } = context
    const { combatManager } = player
    const { invokeList } = data

    for (let invokeEntry of invokeList) await combatManager.handleInvokeEntry(invokeEntry, seqId)
  }

  async sendNotify(context: PacketContext, data: CombatInvocationsNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], invokeList: CombatInvokeEntry[]): Promise<void> {
    const notifyData: CombatInvocationsNotify = { invokeList }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: CombatInvocationsPacket
export default (() => packet = packet || new CombatInvocationsPacket())()