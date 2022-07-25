import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { RetcodeEnum, SceneEnterReasonEnum, SceneEnterTypeEnum } from '@/types/proto/enum'

export interface WorldPlayerReviveReq { }

export interface WorldPlayerReviveRsp {
  retcode: RetcodeEnum
}

class WorldPlayerRevivePacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerRevive', {
      reqState: ClientStateEnum.IN_GAME,
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