import Packet, { PacketContext, PacketInterface } from '#/packet'
import { ClientStateEnum } from '@/types/enum'
import { VisionTypeEnum } from '@/types/proto/enum'

export interface SceneEntityDisappearNotify {
  entityList: number[]
  disappearType: VisionTypeEnum
}

class SceneEntityDisappearPacket extends Packet implements PacketInterface {
  constructor() {
    super('SceneEntityDisappear')
  }

  async sendNotify(context: PacketContext, entityIdList: number[], disappearType: VisionTypeEnum): Promise<void> {
    await this.waitState(context, ClientStateEnum.POST_LOGIN, true)

    const notifyData: SceneEntityDisappearNotify = {
      entityList: entityIdList.filter((id, i, list) => list.indexOf(id) === i),
      disappearType
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: SceneEntityDisappearPacket
export default (() => packet = packet || new SceneEntityDisappearPacket())()