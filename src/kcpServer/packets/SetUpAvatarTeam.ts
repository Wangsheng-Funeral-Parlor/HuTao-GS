import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SetUpAvatarTeamReq {
  teamId: number
  avatarTeamGuidList: string[]
  curAvatarGuid?: string
}

export interface SetUpAvatarTeamRsp {
  retcode: RetcodeEnum
  teamId?: number
  avatarTeamGuidList?: string[]
  curAvatarGuid?: string
}

class SetUpAvatarTeamPacket extends Packet implements PacketInterface {
  constructor() {
    super("SetUpAvatarTeam", {
      reqState: ClientStateEnum.IN_GAME,
      reqStateMask: 0xf0ff,
    })
  }

  async request(context: PacketContext, data: SetUpAvatarTeamReq): Promise<void> {
    const { player, seqId } = context
    const { teamManager, state } = player
    const { teamId, avatarTeamGuidList, curAvatarGuid } = data
    const team = teamManager.getTeam(teamId)

    // Set client state
    player.state = (state & 0xff00) | ClientStateEnum.SETUP_TEAM

    try {
      const retcode = await team.setUpAvatarTeam(data, undefined, seqId)

      await this.response(context, {
        retcode,
        teamId,
        avatarTeamGuidList,
        curAvatarGuid,
      })
    } catch (err) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
    }

    // Set client state
    player.state = state & 0xff00
  }

  async response(context: PacketContext, data: SetUpAvatarTeamRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetUpAvatarTeamPacket
export default (() => (packet = packet || new SetUpAvatarTeamPacket()))()
