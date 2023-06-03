import Packet, { PacketInterface, PacketContext } from "#/packet"
import { PlayerPropEnum } from "@/types/enum"

export interface PlayerPropChangeNotify {
  propType: PlayerPropEnum
  propDelta: number
}

class PlayerPropChangePacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerPropChange")
  }

  async sendNotify(context: PacketContext, type: PlayerPropEnum, delta: number): Promise<void> {
    const notifyData: PlayerPropChangeNotify = {
      propType: type,
      propDelta: delta,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: PlayerPropChangePacket
export default (() => (packet = packet || new PlayerPropChangePacket()))()
