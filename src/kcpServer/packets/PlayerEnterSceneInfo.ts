import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AvatarEnterSceneInfo } from '@/types/game/avatar'
import { MPLevelEntityInfo, TeamEnterSceneInfo } from '@/types/game/scene'

export interface PlayerEnterSceneInfoNotify {
  curAvatarEntityId: number
  avatarEnterInfo: AvatarEnterSceneInfo[]
  teamEnterInfo: TeamEnterSceneInfo
  mpLevelEntityInfo: MPLevelEntityInfo
  enterSceneToken: number
}

class PlayerEnterSceneInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super('PlayerEnterSceneInfo')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    await super.sendNotify(context, context.player.exportEnterSceneInfo())
  }
}

let packet: PlayerEnterSceneInfoPacket
export default (() => packet = packet || new PlayerEnterSceneInfoPacket())()