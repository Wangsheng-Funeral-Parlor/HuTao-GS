import Packet, { PacketInterface, PacketContext } from '#/packet'
import Scene from '$/scene'
import { ClientStateEnum } from '@/types/enum'

export interface DelTeamEntityNotify {
  sceneId: number
  delEntityIdList: number[]
}

class DelTeamEntityPacket extends Packet implements PacketInterface {
  constructor() {
    super('DelTeamEntity')
  }

  async sendNotify(context: PacketContext, scene: Scene, entityIdList: number[]): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.POST_LOGIN, true)) return

    const notifyData: DelTeamEntityNotify = {
      sceneId: scene.id,
      delEntityIdList: entityIdList
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: DelTeamEntityPacket
export default (() => packet = packet || new DelTeamEntityPacket())()