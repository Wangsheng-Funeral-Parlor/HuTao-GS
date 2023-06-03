import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { TeamEntityInfo } from "@/types/proto"

export interface SyncTeamEntityNotify {
  sceneId: number
  teamEntityInfoList: TeamEntityInfo[]
}

class SyncTeamEntityPacket extends Packet implements PacketInterface {
  constructor() {
    super("SyncTeamEntity")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE, true)) return

    const { player: targetPlayer } = context
    const { id, playerList } = targetPlayer.currentScene
    const teamEntityInfoList = []

    for (const player of playerList) {
      if (player === targetPlayer) continue
      teamEntityInfoList.push(player.teamManager.exportTeamEntityInfo())
    }

    const notifyData: SyncTeamEntityNotify = {
      sceneId: id,
      teamEntityInfoList,
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: SyncTeamEntityPacket
export default (() => (packet = packet || new SyncTeamEntityPacket()))()
