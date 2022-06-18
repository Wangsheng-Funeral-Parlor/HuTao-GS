import Packet, { PacketInterface, PacketContext } from '#/packet'
import { PlayerDieTypeEnum } from '@/types/enum/player'
import { RetcodeEnum } from '@/types/enum/retcode'
import { ClientState } from '@/types/enum/state'

export interface SceneEntityDrownReq {
  entityId: number
}

export interface SceneEntityDrownRsp {
  retcode: RetcodeEnum
  entityId?: number
}

class SceneEntityDrownPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneEntityDrown', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: SceneEntityDrownReq): Promise<void> {
    const { entityManager } = context.player.currentScene || {}
    const { entityId } = data

    const entity = entityManager?.getEntity(entityId)
    if (!entity) await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })

    entity.kill(0, PlayerDieTypeEnum.PLAYER_DIE_NONE)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      entityId
    })
  }

  async response(context: PacketContext, data: SceneEntityDrownRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SceneEntityDrownPacket
export default (() => packet = packet || new SceneEntityDrownPacket())()