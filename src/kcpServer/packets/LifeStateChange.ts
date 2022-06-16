import Packet, { PacketInterface, PacketContext } from '#/packet'
import Entity from '$/entity'
import { LifeStateEnum } from '@/types/enum/entity'
import { PlayerDieTypeEnum } from '@/types/enum/player'
import { ClientState } from '@/types/enum/state'
import { ServerBuff } from '@/types/game/avatar'

export interface LifeStateChangeNotify {
  entityId: number
  lifeState: LifeStateEnum
  sourceEntityId: number
  attackTag?: string
  dieType: PlayerDieTypeEnum
  moveReliableSeq?: number
  serverBuffList: ServerBuff[]
}

class LifeStateChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('LifeStateChange')
  }

  async sendNotify(context: PacketContext, targetEntity: Entity): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.ENTER_SCENE_DONE, true, 0xF0FF)) return

    const { entityId, lifeState, dieType, attackerId, motionInfo } = targetEntity

    const notifyData: LifeStateChangeNotify = {
      entityId,
      lifeState,
      sourceEntityId: attackerId,
      dieType,
      moveReliableSeq: motionInfo.reliableSeq,
      serverBuffList: []
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], targetEntity: Entity): Promise<void> {
    await super.broadcastNotify(contextList, targetEntity)
  }
}

let packet: LifeStateChangePacket
export default (() => packet = packet || new LifeStateChangePacket())()