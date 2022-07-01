import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AbilityInvokeEntry } from '@/types/game/invoke'

export interface ClientAbilityChangeNotify {
  entityId: number
  invokes: AbilityInvokeEntry[]
  flag?: boolean
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
    const { entityId, invokes, flag } = data

    if (invokes.length === 0) {
      const { broadcastContextList } = currentScene
      for (let broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await this.broadcastNotify(broadcastContextList.filter(ctx => ctx.player !== player), [], entityId, !!flag)
      return
    }

    for (let invokeEntry of invokes) forwardBuffer.addEntry(this, invokeEntry, seqId)
    forwardBuffer.setAdditionalData(seqId, entityId, !!flag)

    forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: ClientAbilityChangeNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], invokes: AbilityInvokeEntry[], entityId: number, flag: boolean): Promise<void> {
    const notifyData: ClientAbilityChangeNotify = {
      entityId,
      invokes,
      flag
    }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: ClientAbilityChangePacket
export default (() => packet = packet || new ClientAbilityChangePacket())()