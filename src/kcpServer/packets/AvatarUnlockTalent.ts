import Packet, { PacketContext, PacketInterface } from '#/packet'
import Talent from '$/entity/avatar/talent'

export interface AvatarUnlockTalentNotify {
  avatarGuid: string
  entityId: number
  talentId: number
  skillDepotId: number
}

class AvatarUnlockTalentPacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarUnlockTalent')
  }

  async sendNotify(context: PacketContext, talent: Talent): Promise<void> {
    const { manager, id } = talent
    const { avatar } = manager
    const { guid, entityId, skillManager } = avatar
    const { currentDepot } = skillManager

    const notifyData: AvatarUnlockTalentNotify = {
      avatarGuid: guid.toString(),
      entityId,
      talentId: id,
      skillDepotId: currentDepot?.id || 0
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], talent: Talent): Promise<void> {
    await super.broadcastNotify(contextList, talent)
  }
}

let packet: AvatarUnlockTalentPacket
export default (() => packet = packet || new AvatarUnlockTalentPacket())()