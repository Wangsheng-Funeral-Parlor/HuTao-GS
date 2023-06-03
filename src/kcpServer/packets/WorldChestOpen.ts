import Packet, { PacketInterface, PacketContext } from "#/packet"
import Gadget from "$/entity/gadget"

export interface WorldChestOpenNotify {
  configId: number
  groupId: number
  sceneId: number
}

class WorldChestOpenPacket extends Packet implements PacketInterface {
  constructor() {
    super("WorldChestOpen")
  }

  async sendNotify(context: PacketContext, gadged: Gadget): Promise<void> {
    const notifyData: WorldChestOpenNotify = {
      configId: gadged.configId,
      groupId: gadged.groupId,
      sceneId: context.player.currentScene.id,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: WorldChestOpenPacket
export default (() => (packet = packet || new WorldChestOpenPacket()))()
