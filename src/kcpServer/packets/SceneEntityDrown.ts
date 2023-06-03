import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { PlayerDieTypeEnum, RetcodeEnum } from "@/types/proto/enum"

export interface SceneEntityDrownReq {
  entityId: number
}

export interface SceneEntityDrownRsp {
  retcode: RetcodeEnum
  entityId?: number
}

class SceneEntityDrownPacket extends Packet implements PacketInterface {
  constructor() {
    super("SceneEntityDrown", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SceneEntityDrownReq): Promise<void> {
    const { player, seqId } = context
    const { entityManager } = player.currentScene || {}
    const { entityId } = data

    const entity = entityManager?.getEntity(entityId, true)
    if (!entity) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })
      return
    }

    entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE, seqId)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId,
    })
  }

  async response(context: PacketContext, data: SceneEntityDrownRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SceneEntityDrownPacket
export default (() => (packet = packet || new SceneEntityDrownPacket()))()
