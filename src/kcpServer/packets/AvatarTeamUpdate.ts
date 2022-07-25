import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { AvatarTeam } from '@/types/proto'

export interface AvatarTeamUpdateNotify {
  avatarTeamMap: { [id: number]: AvatarTeam }
  teamAvatarGuidList: string[]
}

class AvatarTeamUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarTeamUpdate')
  }

  async sendNotify(context: PacketContext, teamId?: number): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

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