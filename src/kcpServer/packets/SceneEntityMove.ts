import Packet, { PacketContext, PacketInterface } from "#/packet"
import Entity from "$/entity"
import { ClientStateEnum } from "@/types/enum"
import { MotionInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SceneEntityMoveReq {
  entityId: number
  motionInfo: MotionInfo
  sceneTime: number
  reliableSeq: number
}

export interface SceneEntityMoveRsp {
  retcode: RetcodeEnum
  entityId?: number
  failMotion?: MotionInfo
  sceneTime?: number
  reliableSeq?: number
}

export interface SceneEntityMoveNotify {
  entityId: number
  motionInfo: MotionInfo
  sceneTime: number
  reliableSeq: number
}

class SceneEntityMovePacket extends Packet implements PacketInterface {
  constructor() {
    super("SceneEntityMove", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SceneEntityMoveReq): Promise<void> {
    const { currentScene } = context.player
    const { entityManager } = currentScene
    const { entityId, motionInfo, sceneTime, reliableSeq } = data
    const entity = entityManager.getEntity(entityId, true)

    if (!entity) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })
      return
    }

    entity.motion.update(motionInfo, sceneTime, reliableSeq)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId,
      failMotion: motionInfo,
      sceneTime,
      reliableSeq,
    })

    this.broadcastNotify(currentScene.broadcastContextList, entity)
  }

  async response(context: PacketContext, data: SceneEntityMoveRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext, entity: Entity): Promise<void> {
    const { entityId, motion } = entity
    const { sceneTime, reliableSeq } = motion

    const notifyData: SceneEntityMoveNotify = {
      entityId: entityId,
      motionInfo: motion.export(),
      sceneTime,
      reliableSeq,
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], entity: Entity): Promise<void> {
    await super.broadcastNotify(contextList, entity)
  }
}

let packet: SceneEntityMovePacket
export default (() => (packet = packet || new SceneEntityMovePacket()))()
