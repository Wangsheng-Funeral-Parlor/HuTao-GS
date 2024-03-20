import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { MotionInfo } from '@/types/proto'
import { RetcodeEnum } from '@/types/proto/enum'

export interface EntityForceSyncReq {
  roomId: number
  entityId: number
  motionInfo: MotionInfo
  sceneTime: number
}

export interface EntityForceSyncRsp {
  retcode: RetcodeEnum
  entityId?: number
  failMotion?: MotionInfo
  sceneTime?: number
}

class EntityForceSyncPacket extends Packet implements PacketInterface {
  constructor() {
    super('EntityForceSync', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: EntityForceSyncReq): Promise<void> {
    const { currentScene } = context.player
    const { entityManager } = currentScene
    const { entityId, motionInfo, sceneTime } = data
    const entity = entityManager.getEntity(entityId, true)

    if (!entity) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })
      return
    }

    entity.motion.update(motionInfo, sceneTime)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId,
      sceneTime
    })
  }

  async response(context: PacketContext, data: EntityForceSyncRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: EntityForceSyncPacket
export default (() => packet = packet || new EntityForceSyncPacket())()