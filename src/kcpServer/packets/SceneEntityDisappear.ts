import Packet, { PacketInterface, PacketContext } from '#/packet'
import { VisionTypeEnum } from '@/types/enum/entity'
import { ClientState } from '@/types/enum/state'

export interface SceneEntityDisappearNotify {
  entityList: number[]
  disappearType: VisionTypeEnum
}

class SceneEntityDisappearPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneEntityDisappear')
  }

  async sendNotify(context: PacketContext, entityIdList: number[], disappearType: VisionTypeEnum): Promise<void> {
    await this.waitState(context, ClientState.POST_LOGIN, true)

    const notifyData: SceneEntityDisappearNotify = {
      entityList: entityIdList,
      disappearType
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: SceneEntityDisappearPacket
export default (() => packet = packet || new SceneEntityDisappearPacket())()