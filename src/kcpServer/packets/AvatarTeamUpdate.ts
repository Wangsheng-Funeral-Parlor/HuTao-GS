import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AvatarTeam } from '@/types/game/team'

export interface AvatarTeamUpdateNotify {
  avatarTeamMap: { [id: number]: AvatarTeam }
  teamAvatarGuidList: string[]
}

class AvatarTeamUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarTeamUpdate')
  }

  async sendNotify(context: PacketContext, teamId?: number): Promise<void> {
    if (!this.checkState(context, ClientState.IN_GAME, true)) return

    const notifyData: AvatarTeamUpdateNotify = {
      avatarTeamMap: context.player.teamManager.exportAvatarTeamMap(teamId),
      teamAvatarGuidList: []
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], teamId?: number): Promise<void> {
    await super.broadcastNotify(contextList, teamId)
  }
}

let packet: AvatarTeamUpdatePacket
export default (() => packet = packet || new AvatarTeamUpdatePacket())()