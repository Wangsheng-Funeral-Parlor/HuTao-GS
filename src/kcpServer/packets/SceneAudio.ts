import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'

export interface SceneAudioNotify {
  sourceUid: number
  type: number
  param1: number[]
  param2: number[]
  param3: string[]
}

class SceneAudioPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneAudio', {
      notifyState: ClientState.IN_GAME,
      notifyStateMask: 0xF0FF
    })
  }

  async recvNotify(context: PacketContext, data: SceneAudioNotify): Promise<void> {
    const { broadcastContextList } = context.player.currentScene
    const { sourceUid } = data

    await this.broadcastNotify(broadcastContextList.filter(t => t.player.uid !== sourceUid), data)
  }

  async sendNotify(context: PacketContext, data: SceneAudioNotify): Promise<void> {
    await super.sendNotify(context, data)
  }

  async broadcastNotify(contextList: PacketContext[], data: SceneAudioNotify): Promise<void> {
    await super.broadcastNotify(contextList, data)
  }
}

let packet: SceneAudioPacket
export default (() => packet = packet || new SceneAudioPacket())()