import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { CombatInvokeEntry } from '@/types/proto'

export interface CombatInvocationsNotify {
  invokeList: CombatInvokeEntry[]
}

class CombatInvocationsPacket extends Packet implements PacketInterface {
  constructor() {
    super('CombatInvocations', {
      notifyState: ClientStateEnum.IN_GAME,
      notifyStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: CombatInvocationsNotify): Promise<void> {
    const { player } = context
    const { currentScene } = player
    const { invokeList } = data

    await currentScene.combatInvoke(context, invokeList)
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