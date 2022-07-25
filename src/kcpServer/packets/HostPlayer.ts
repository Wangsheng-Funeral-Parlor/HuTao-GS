import Packet, { PacketInterface, PacketContext } from '#/packet'
import { ClientStateEnum } from '@/types/enum'

export interface HostPlayerNotify {
  hostUid: number
  hostPeerId: number
}

class HostPlayerPacket extends Packet implements PacketInterface {
  constructor() {
    super('HostPlayer')
  }

  async sendNotify(context: PacketContext): Promise<void> {
    if (!this.checkState(context, ClientStateEnum.ENTER_SCENE | ClientStateEnum.PRE_SCENE_INIT_FINISH, false, 0xF0FF)) return

    const { uid, peerId } = context.player.currentWorld.host

    const notifyData: HostPlayerNotify = {
      hostUid: uid,
      hostPeerId: peerId
    }

    await super.sendNotify(context, notifyData)
  }
}

let packet: HostPlayerPacket
export default (() => packet = packet || new HostPlayerPacket())()