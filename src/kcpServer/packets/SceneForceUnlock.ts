import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientStateEnum } from '@/types/enum'

export interface SceneForceUnlockNotify {
  forceIdList: number[]
  isAdd?: boolean
}

class SceneForceUnlockPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneForceUnlock')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    const notifyData: SceneForceUnlockNotify = {
      forceIdList: []
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: SceneForceUnlockPacket
export default (() => packet = packet || new SceneForceUnlockPacket())()