import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { PlayerLocationInfo, VehicleLocationInfo } from '@/types/proto'

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
    if (!this.checkState(context, ClientStateEnum.IN_GAME, true)) return

    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: ScenePlayerLocationNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: ScenePlayerLocationPacket
export default (() => packet = packet || new ScenePlayerLocationPacket())()