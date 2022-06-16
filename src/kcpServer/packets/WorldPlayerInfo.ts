import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { OnlinePlayerInfo } from '@/types/game/playerInfo'

export interface WorldPlayerInfoNotify {
  playerInfoList: OnlinePlayerInfo[]
  playerUidList: number[]
}

class WorldPlayerInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('WorldPlayerInfo')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, true)) return

    const { currentWorld } = context.player

    const notifyData: WorldPlayerInfoNotify = {
      playerInfoList: currentWorld.exportWorldPlayerInfoList(),
      playerUidList: currentWorld.playerList.map(p => p.uid)
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: WorldPlayerInfoPacket
export default (() => packet = packet || new WorldPlayerInfoPacket())()