import Packet, { PacketInterface, PacketContext } from "#/packet"
import Player from "$/player"
import Scene from "$/scene"

export interface GuestBeginEnterSceneNotify {
  uid: number
  sceneId: number
}

class GuestBeginEnterScenePacket extends Packet implements PacketInterface {
  constructor() {
    super("GuestBeginEnterScene")
  }

  async sendNotify(context: PacketContext, scene: Scene, player: Player): Promise<void> {
    const notifyData: GuestBeginEnterSceneNotify = {
      uid: player.uid,
      sceneId: scene.id,
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: GuestBeginEnterScenePacket
export default (() => (packet = packet || new GuestBeginEnterScenePacket()))()
