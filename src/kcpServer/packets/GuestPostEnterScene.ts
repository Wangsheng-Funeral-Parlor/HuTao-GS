import Packet, { PacketInterface, PacketContext } from '#/packet'
import Player from '$/player'
import Scene from '$/scene'

export interface GuestPostEnterSceneNotify {
  uid: number
  sceneId: number
}

class GuestPostEnterScenePacket extends Packet implements PacketInterface {
  constructor() {
    super('GuestPostEnterScene')
  }

  async sendNotify(context: PacketContext, scene: Scene, player: Player): Promise<void> {
    const notifyData: GuestPostEnterSceneNotify = {
      uid: player.uid,
      sceneId: scene.id
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: GuestPostEnterScenePacket
export default (() => packet = packet || new GuestPostEnterScenePacket())()