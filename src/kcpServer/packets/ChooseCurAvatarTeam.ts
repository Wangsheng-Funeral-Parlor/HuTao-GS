import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface ChooseCurAvatarTeamReq {
  teamId: number
}

export interface ChooseCurAvatarTeamRsp {
  retcode: RetcodeEnum
  curTeamId: number
}

class ChooseCurAvatarTeamPacket extends Packet implements PacketInterface {
  constructor() {
    super('ChooseCurAvatarTeam', {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xF0FF
    })
  }

  async request(context: PacketContext, data: ChooseCurAvatarTeamReq): Promise<void> {
    const { player, seqId } = context
    const { state } = player
    const { teamId } = data

    // Set client state
    player.state = (state & 0xFF00) | ClientStateEnum.CHANGE_TEAM

    const retcode = await player.teamManager.setTeam(teamId, seqId)

    await this.response(context, {
      retcode,
      curTeamId: teamId
    })

    // Set client state
    player.state = (state & 0xFF00)
  }

  async response(context: PacketContext, data: ChooseCurAvatarTeamRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: ChooseCurAvatarTeamPacket
export default (() => packet = packet || new ChooseCurAvatarTeamPacket())()