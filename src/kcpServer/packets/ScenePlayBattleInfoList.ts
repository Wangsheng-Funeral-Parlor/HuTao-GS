import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { ScenePlayBattleInfo } from '@/types/proto'

export interface ScenePlayBattleInfoListNotify {
  battleInfo?: ScenePlayBattleInfo
}

class ScenePlayBattleInfoListPacket extends Packet implements PacketInterface {
  constructor() {
    super('ScenePlayBattleInfoList')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    const notifyData: ScenePlayBattleInfoListNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: ScenePlayBattleInfoListPacket
export default (() => packet = packet || new ScenePlayBattleInfoListPacket())()