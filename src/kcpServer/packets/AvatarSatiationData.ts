import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientState } from '@/types/enum/state'
import { AvatarSatiationData } from '@/types/game/avatar'

export interface AvatarSatiationDataNotify {
  satiationDataList: AvatarSatiationData[]
}

class AvatarSatiationDataPacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarSatiationData')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientState.LOGIN, true)) return

    const notifyData: AvatarSatiationDataNotify = {
      satiationDataList: context.player.avatarList.map(a => a.exportSatiationData())
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: AvatarSatiationDataPacket
export default (() => packet = packet || new AvatarSatiationDataPacket())()