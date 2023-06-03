import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"

export interface OpenStateUpdateNotify {
  openStateMap: { [key: number]: number }
}

class OpenStateUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super("OpenStateUpdate")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.LOGIN)) return

    const notifyData: OpenStateUpdateNotify = {
      openStateMap: context.player.openState.exportOpenStateMap(),
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: OpenStateUpdatePacket
export default (() => (packet = packet || new OpenStateUpdatePacket()))()
