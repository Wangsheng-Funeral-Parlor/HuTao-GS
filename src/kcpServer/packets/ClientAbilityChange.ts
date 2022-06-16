import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AbilityInvokeEntry } from '@/types/game/invoke'

export interface ClientAbilityChangeNotify {
  entityId: number
  invokes: AbilityInvokeEntry[]
}

class ClientAbilityChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientAbilityChange', {
      notifyWaitState: ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_READY,
      notifyWaitStateMask: 0xF0FF,
      notifyWaitStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: ClientAbilityChangeNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer, currentScene } = player
    const { entityId, invokes } = data

    if (invokes.length === 0) {
      const { broadcastContextList } = currentScene
      for (let broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await this.broadcastNotify(broadcastContextList.filter(ctx => ctx.player !== player), [], entityId)
      return
    }

    for (let invokeEntry of invokes) {
      forwardBuffer.addEntry(this, invokeEntry, seqId)
    }

    forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: ClientAbilityChangeNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], invokeList: AbilityInvokeEntry[], entityId?: number): Promise<void> {
    const notifyData: ClientAbilityChangeNotify = {
      entityId: invokeList?.[0]?.entityId || entityId,
      invokes: invokeList
    }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: ClientAbilityChangePacket
export default (() => packet = packet || new ClientAbilityChangePacket())()