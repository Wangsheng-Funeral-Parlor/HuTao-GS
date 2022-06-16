import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { VehicleLocationInfo } from '@/types/game/vehicle'
import { PlayerLocationInfo } from '@/types/game/world'

export interface ScenePlayerLocationNotify {
  sceneId: number
  playerLocList: PlayerLocationInfo[]
  vehicleLocList: VehicleLocationInfo[]
}

class ScenePlayerLocationPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePlayerLocation')
  }

  async sendNotify(context: PacketContext, data: ScenePlayerLocationNotify): Promise<void> {
    if (!this.checkState(context, ClientState.IN_GAME, true)) return

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: ScenePlayerLocationNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: ScenePlayerLocationPacket
export default (() => packet = packet || new ScenePlayerLocationPacket())()