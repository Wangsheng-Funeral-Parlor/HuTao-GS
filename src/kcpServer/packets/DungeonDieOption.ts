import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PlayerDieOptionEnum, RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'

export interface DungeonDieOptionReq {
  dieOption: PlayerDieOptionEnum
  isQuitImmediately: boolean
}

export interface DungeonDieOptionRsp {
  retcode: RetcodeEnum
  dieOption?: PlayerDieOptionEnum
  reviveCount?: number
}

class DungeonDieOptionPacket extends Packet implements PacketInterface {
  constructor() {
    super('DungeonDieOption', {
      reqState: ClientStateEnum.IN_GAME | ClientStateEnum.SCENE_DUNGEON,
      reqStateMask: 0xFF00
    })
  }

  async request(context: PacketContext, data: DungeonDieOptionReq): Promise<void> {
    const { player } = context
    const { teamManager, currentScene, pos, rot } = player
    const { dieOption } = data

    switch (dieOption) {
      case PlayerDieOptionEnum.DIE_OPT_CANCEL:
        if (!await player.returnToPrevScene(SceneEnterReasonEnum.DUNGEON_QUIT)) {
          await this.response(context, { retcode: RetcodeEnum.RET_DUNGEON_QUIT_FAIL })
          return
        }
        break
      case PlayerDieOptionEnum.DIE_OPT_REPLAY:
        if (!await currentScene.join(context, pos.clone(), rot.clone(), SceneEnterTypeEnum.ENTER_DUNGEON_REPLAY, SceneEnterReasonEnum.DUNGEON_REPLAY)) {
          await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_FAIL })
          return
        }
        break
      case PlayerDieOptionEnum.DIE_OPT_REVIVE:
        await teamManager.getTeam()?.reviveAllAvatar()
        if (!await currentScene.join(context, pos.clone(), rot.clone(), SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.DUNGEON_REVIVE_ON_WAYPOINT)) {
          await this.response(context, { retcode: RetcodeEnum.RET_ENTER_SCENE_FAIL })
          return
        }
        break
      default:
        await this.response(context, { retcode: RetcodeEnum.RET_SVR_ERROR })
        return
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      dieOption,
      reviveCount: 0
    })
  }

  async response(context: PacketContext, data: DungeonDieOptionRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: DungeonDieOptionPacket
export default (() => packet = packet || new DungeonDieOptionPacket())()