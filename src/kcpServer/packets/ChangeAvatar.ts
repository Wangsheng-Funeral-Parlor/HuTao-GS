import Packet, { PacketInterface, PacketContext } from '#/packet'
import Vector from '$/utils/vector'
import { RetcodeEnum } from '@/types/enum/retcode'
import { VectorInterface } from '@/types/game/motion'
import { ClientState } from '@/types/enum/state'

export interface ChangeAvatarReq {
  guid: string
  skillId: number
  isMove: boolean
  movePos: VectorInterface
}

export interface ChangeAvatarRsp {
  retcode: RetcodeEnum
  curGuid?: string
  skillId?: number
}

class ChangeAvatarPacket extends Packet implements PacketInterface {
  constructor() {
    super('ChangeAvatar', {
      reqState: ClientState.IN_GAME,
      reqStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: ChangeAvatarReq): Promise<void> {
    const { player, seqId } = context
    const { state } = player
    const { guid, skillId, isMove, movePos } = data

    // Set client state
    player.state = (state & 0xFF00) | ClientState.CHANGE_AVATAR

    const team = player.teamManager.getTeam()
    const avatar = team.getAvatar(BigInt(guid))
    const retcode = await player.changeAvatar(avatar, isMove ? new Vector(movePos.X, movePos.Y, movePos.Z) : undefined, seqId)

    await this.response(context, {
      retcode,
      curGuid: guid,
      skillId
    })

    // Set client state
    player.state = (state & 0xFF00)
  }

  async response(context: PacketContext, data: ChangeAvatarRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ChangeAvatarPacket
export default (() => packet = packet || new ChangeAvatarPacket())()