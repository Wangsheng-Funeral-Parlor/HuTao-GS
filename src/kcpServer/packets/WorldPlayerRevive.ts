import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/enum/scene'
import { ClientState } from '@/types/enum/state'

export interface WorldPlayerReviveReq { }

export interface WorldPlayerReviveRsp {
  retcode: RetcodeEnum
}

class WorldPlayerRevivePacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerRevive', {
      reqState: ClientState.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, _data: WorldPlayerReviveReq): Promise<void> {
    const { player } = context
    const { teamManager, currentScene, lastSafePos, lastSafeRot } = player

    // Revive all avatar
    const team = teamManager.getTeam()
    await team.reviveAllAvatar()

    // Teleport player
    await currentScene.join(context, lastSafePos.clone(), lastSafeRot.clone(), SceneEnterTypeEnum.ENTER_JUMP, SceneEnterReasonEnum.REVIVAL)

    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: WorldPlayerReviveRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: WorldPlayerRevivePacket
export default (() => packet = packet || new WorldPlayerRevivePacket())()