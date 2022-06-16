import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { TeamEntityInfo } from '@/types/game/team'

export interface SyncTeamEntityNotify {
  sceneId: number
  teamEntityInfoList: TeamEntityInfo[]
}

class SyncTeamEntityPacket extends Packet implements PacketInterface {
  constructor() {
    super('SyncTeamEntity')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE, true)) return

    const { player: targetPlayer } = context
    const { id, playerList } = targetPlayer.currentScene
    const teamEntityInfoList = []

    for (let player of playerList) {
      if (player === targetPlayer) continue
      teamEntityInfoList.push(player.teamManager.exportTeamEntityInfo())
    }

    const notifyData: SyncTeamEntityNotify = {
      sceneId: id,
      teamEntityInfoList
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: SyncTeamEntityPacket
export default (() => packet = packet || new SyncTeamEntityPacket())()