import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'
import WorldPlayerDie from './WorldPlayerDie'
import { VectorInfo } from '@/types/proto'

export interface AvatarDieAnimationEndReq {
  dieGuid: string
  skillId: number
  rebornPos: VectorInfo
}

export interface AvatarDieAnimationEndRsp {
  retcode: RetcodeEnum
  dieGuid?: string
  skillId?: number
}

class AvatarDieAnimationEndPacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarDieAnimationEnd', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: AvatarDieAnimationEndReq): Promise<void> {
    const { player, seqId } = context
    const { teamManager, currentAvatar } = player
    const { dieGuid, skillId, rebornPos } = data

    if (parseInt(dieGuid) !== currentAvatar.entityId) {
      await this.response(context, { retcode: RetcodeEnum.RET_CAN_NOT_FIND_AVATAR })
      return
    }

    if (currentAvatar.isAlive()) {
      await this.response(context, { retcode: RetcodeEnum.RET_AVATAR_NOT_DEAD })
      return
    }

    // Get replacement avatar
    const team = teamManager.getTeam()
    const replacement = team.getAliveAvatar()

    if (replacement) {
      // Replace current avatar
      await player.changeAvatar(replacement, new Vector(rebornPos.x, rebornPos.y, rebornPos.z), seqId)
    } else {
      // Great, everyone is dead
      await WorldPlayerDie.sendNotify(context, currentAvatar)
    }

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      dieGuid,
      skillId
    })
  }

  async response(context: PacketContext, data: AvatarDieAnimationEndRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: AvatarDieAnimationEndPacket
export default (() => packet = packet || new AvatarDieAnimationEndPacket())()