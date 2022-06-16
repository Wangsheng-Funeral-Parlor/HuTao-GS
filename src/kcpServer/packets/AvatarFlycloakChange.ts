import Packet, { PacketInterface, PacketContext } from '#/packet'
import Avatar from '$/entity/avatar'

export interface AvatarFlycloakChangeNotify {
  avatarGuid: string
  flycloakId: number
}

class AvatarFlycloakChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarFlycloakChange')
  }

  async sendNotify(context: PacketContext, avatar: Avatar): Promise<void> {
    const notifyData: AvatarFlycloakChangeNotify = {
      avatarGuid: avatar.guid.toString(),
      flycloakId: avatar.wearingFlycloakId
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], avatar: Avatar): Promise<void> {
    await super.broadcastNotify(contextList, avatar)
  }
}

let packet: AvatarFlycloakChangePacket
export default (() => packet = packet || new AvatarFlycloakChangePacket())()