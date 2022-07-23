import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/enum/Retcode'
import { ClientState } from '@/types/enum/state'
import { VectorInterface } from '@/types/game/motion'
import WorldPlayerDie from './WorldPlayerDie'

export interface AvatarDieAnimationEndReq {
  dieGuid: string
  skillId: number
  rebornPos: VectorInterface
}

export interface AvatarDieAnimationEndRsp {
  retcode: RetcodeEnum
  dieGuid?: string
  skillId?: number
}

class AvatarDieAnimationEndPacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarDieAnimationEnd', {
      reqState: ClientState.IN_GAME,
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
      await player.changeAvatar(replacement, new Vector(rebornPos.X, rebornPos.Y, rebornPos.Z), seqId)
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