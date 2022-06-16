import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { ScenePlayBattleInfo } from '@/types/game/scene'

export interface ScenePlayBattleInfoListNotify {
  battleInfo?: ScenePlayBattleInfo
}

class ScenePlayBattleInfoListPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePlayBattleInfoList')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.ENTER_SCENE | ClientState.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    const notifyData: ScenePlayBattleInfoListNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: ScenePlayBattleInfoListPacket
export default (() => packet = packet || new ScenePlayBattleInfoListPacket())()