import Packet, { PacketContext, PacketInterface } from '#/packet'
import Entity from '$/entity'
import { ClientStateEnum } from '@/types/enum'
import { ServerBuff } from '@/types/proto'
import { LifeStateEnum, PlayerDieTypeEnum } from '@/types/proto/enum'

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
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.ENTER_SCENE_DONE, true, 0xF0FF)) return

    const { entityId, lifeState, dieType, attackerId, motion } = targetEntity

    const notifyData: LifeStateChangeNotify = {
      entityId,
      lifeState,
      sourceEntityId: attackerId,
      dieType,
      moveReliableSeq: motion.reliableSeq,
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