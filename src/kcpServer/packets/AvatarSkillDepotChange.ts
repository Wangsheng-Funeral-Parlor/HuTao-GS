import Packet, { PacketInterface, PacketContext } from '#/packet'
import Avatar from '$/entity/avatar'

export interface AvatarSkillDepotChangeNotify {
  avatarGuid: string
  entityId: number
  skillDepotId: number
  talentIdList: number[]
  proudSkillList: number[]
  coreProudSkillLevel: number
  skillLevelMap: { [id: number]: number }
  proudSkillExtraLevelMap: { [id: number]: number }
}

class AvatarSkillDepotChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarSkillDepotChange')
  }

  async sendNotify(context: PacketContext, avatar: Avatar): Promise<void> {
    const { guid, entityId, skillManager } = avatar
    const { inherentProudSkillList, skillLevelMap, proudSkillExtraLevelMap, talentIdList } = skillManager.export()

    const notifyData: AvatarSkillDepotChangeNotify = {
      avatarGuid: guid.toString(),
      entityId,
      skillDepotId: skillManager.currentDepot?.id || 0,
      talentIdList,
      proudSkillList: inherentProudSkillList,
      coreProudSkillLevel: 1,
      skillLevelMap,
      proudSkillExtraLevelMap
    }

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], avatar: Avatar): Promise<void> {
    await super.broadcastNotify(contextList, avatar)
  }
}

let packet: AvatarSkillDepotChangePacket
export default (() => packet = packet || new AvatarSkillDepotChangePacket())()