import Packet, { PacketContext, PacketInterface } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { AvatarEnterSceneInfo, MPLevelEntityInfo, TeamEnterSceneInfo } from "@/types/proto"

export interface PlayerEnterSceneInfoNotify {
  curAvatarEntityId: number
  avatarEnterInfo: AvatarEnterSceneInfo[]
  teamEnterInfo: TeamEnterSceneInfo
  mpLevelEntityInfo: MPLevelEntityInfo
  enterSceneToken: number
}

class PlayerEnterSceneInfoPacket extends Packet implements PacketInterface {
  constructor() {
    super("PlayerEnterSceneInfo")
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, false, 0xf0ff))
      return

    await super.sendNotify(context, context.player.exportEnterSceneInfo())
  }
}

let packet: PlayerEnterSceneInfoPacket
export default (() => (packet = packet || new PlayerEnterSceneInfoPacket()))()
