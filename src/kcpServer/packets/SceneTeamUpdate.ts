import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { SceneTeamAvatar } from '@/types/game/team'

export interface SceneTeamUpdateNotify {
  sceneTeamAvatarList: SceneTeamAvatar[]
  isInMp?: boolean
}

class SceneTeamUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneTeamUpdate')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, true)) return

    const notifyData: SceneTeamUpdateNotify = {
      sceneTeamAvatarList: context.player.currentScene.exportSceneTeamAvatarList(),
      isInMp: context.player.isInMp()
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[]): Promise<void> {
    await super.broadcastNotify(contextList)
  }
}

let packet: SceneTeamUpdatePacket
export default (() => packet = packet || new SceneTeamUpdatePacket())()