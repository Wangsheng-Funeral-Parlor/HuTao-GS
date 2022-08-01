import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { AbilityInvokeEntry } from '@/types/proto'

export interface ClientAbilityChangeNotify {
  entityId: number
  invokes: AbilityInvokeEntry[]
  flag?: boolean
}

class ClientAbilityChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('ClientAbilityChange', {
      notifyWaitState: ClientStateEnum.ENTER_SCENE | ClientStateEnum.ENTER_SCENE_READY,
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
      for (const broadcastCtx of broadcastContextList) broadcastCtx.seqId = seqId

      await this.broadcastNotify(broadcastContextList.filter(ctx => ctx.player !== player), [], entityId, !!flag)
      return
    }

    await currentScene.clientAbilityChange(context, invokes, entityId, flag)
    await forwardBuffer.sendAll()
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