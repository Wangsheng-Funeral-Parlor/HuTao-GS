import Packet, { PacketInterface, PacketContext } from '#/packet'

export interface AvatarFightPropUpdateNotify {
  avatarGuid: string
  fightPropMap: { [type: number]: number }
}

class AvatarFightPropUpdatePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarFightPropUpdate')
  }

  async sendNotify(context: PacketContext, data: AvatarFightPropUpdateNotify): Promise<void> {
    await super.sendNotify(context, data)
  }
}

let packet: AvatarFightPropUpdatePacket
export default (() => packet = packet || new AvatarFightPropUpdatePacket())()