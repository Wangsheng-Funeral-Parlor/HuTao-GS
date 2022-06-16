import Packet, { PacketInterface, PacketContext } from '#/packet'
import { MapMarkPoint } from '@/types/game/map'

export interface AllMarkPointNotify {
  markList: MapMarkPoint[]
}

class AllMarkPointPacket extends Packet implements PacketInterface {
  constructor() {
    super('AllMarkPoint')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: AllMarkPointNotify = {
      markList: []
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AllMarkPointPacket
export default (() => packet = packet || new AllMarkPointPacket())()