import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { AbilityInvokeEntry } from '@/types/proto'

export interface ClientAbilityInitFinishNotify {
  entityId: number
  invokes: AbilityInvokeEntry[]
}

class ClientAbilityInitFinishPacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientAbilityInitFinish', {
      notifyWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.ENTER_SCENE_READY,
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
      for (const broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await this.broadcastNotify(broadcastContextList.filter(ctx => ctx.player !== player), [], entityId)
      return
    }

    await currentScene.clientAbilityInitFinish(context, invokes, entityId)
    await forwardBuffer.sendAll()
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