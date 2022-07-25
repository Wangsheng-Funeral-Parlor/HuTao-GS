import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { RetcodeEnum, SceneEnterReasonEnum } from '@/types/proto/enum'

export interface PlayerQuitDungeonReq {
  pointId: number
}

export interface PlayerQuitDungeonRsp {
  retcode: RetcodeEnum
  pointId?: number
}

class PlayerQuitDungeonPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerQuitDungeon', {
      reqState: ClientStateEnum.IN_GAME | ClientStateEnum.SCENE_DUNGEON,
      reqStateMask: 0xFF00
    })
  }

  async request(context: PacketContext, data: PlayerQuitDungeonReq): Promise<void> {
    const { player } = context
    const { pointId } = data

    if (!await player.returnToPrevScene(SceneEnterReasonEnum.DUNGEON_QUIT)) {
      await this.response(context, { retcode: RetcodeEnum.RET_DUNGEON_QUIT_FAIL })
      return
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      pointId
    })
  }

  async response(context: PacketContext, data: PlayerQuitDungeonRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: PlayerQuitDungeonPacket
export default (() => packet = packet || new PlayerQuitDungeonPacket())()