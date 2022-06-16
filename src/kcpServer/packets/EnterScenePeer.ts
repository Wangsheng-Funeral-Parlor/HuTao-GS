import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'

export interface EnterScenePeerNotify {
  destSceneId: number
  peerId: number
  hostPeerId: number
  enterSceneToken: number
}

class EnterScenePeerPacket extends Packet implements PacketInterface {
  constructor() {
    super('EnterScenePeer')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    await this.waitState(context, ClientState.ENTER_SCENE | ClientState.PRE_ENTER_SCENE_READY, true)

    const { player } = context
    const { currentWorld, currentScene, peerId } = player

    const notifyData: EnterScenePeerNotify = {
      destSceneId: currentScene.id,
      peerId,
      hostPeerId: currentWorld.host.peerId,
      enterSceneToken: currentScene.enterSceneToken
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: EnterScenePeerPacket
export default (() => packet = packet || new EnterScenePeerPacket())()