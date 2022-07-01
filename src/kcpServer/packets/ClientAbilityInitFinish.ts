import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AbilityInvokeEntry } from '@/types/game/invoke'

export interface ClientAbilityInitFinishNotify {
  entityId: number
  invokes: AbilityInvokeEntry[]
}

class ClientAbilityInitFinishPacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientAbilityInitFinish', {
      notifyWaitState: ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_READY,
      notifyWaitStateMask: 0xF0FF,
      notifyWaitStatePass: true
    })
  }

  async recvNotify(context: PacketContext, data: ClientAbilityInitFinishNotify): Promise<void> {
    const { player, seqId } = context
    const { forwardBuffer, currentScene } = player
    const { entityId, invokes } = data

    if (invokes.length === 0) {
      const { broadcastContextList } = currentScene
      for (let broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await this.broadcastNotify(broadcastContextList.filter(ctx => ctx.player !== player), [], entityId)
      return
    }

    for (let invokeEntry of invokes) forwardBuffer.addEntry(this, invokeEntry, seqId)
    forwardBuffer.setAdditionalData(seqId, entityId)

    forwardBuffer.sendAll()
  }

  async sendNotify(context: PacketContext, data: ClientAbilityInitFinishNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], invokes: AbilityInvokeEntry[], entityId: number): Promise<void> {
    const notifyData: ClientAbilityInitFinishNotify = {
      entityId,
      invokes
    }

    await super.broadcastNotify(contextList, notifyData)
  }
}

let packet: ClientAbilityInitFinishPacket
export default (() => packet = packet || new ClientAbilityInitFinishPacket())()