import Packet, { PacketInterface, PacketContext } from '#/packet'
import Avatar from '$/entity/avatar'
import { ProtEntityTypeEnum } from '@/types/enum/entity'
import { SceneReliquaryInfo } from '@/types/game/reliquary'
import { SceneWeaponInfo } from '@/types/game/weapon'

export interface AvatarEquipChangeNotify {
  avatarGuid: string
  equipType: number
  itemId: number
  equipGuid: string
  weapon?: SceneWeaponInfo
  reliquary?: SceneReliquaryInfo
}

class AvatarEquipChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarEquipChange')
  }

  async sendNotify(context: PacketContext, avatar: Avatar, equipType: ProtEntityTypeEnum = ProtEntityTypeEnum.PROT_ENTITY_WEAPON): Promise<void> {
    const notifyData: AvatarEquipChangeNotify = avatar.exportAvatarEquipChange(equipType)

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], avatar: Avatar, equipType: ProtEntityTypeEnum = ProtEntityTypeEnum.PROT_ENTITY_WEAPON): Promise<void> {
    await super.broadcastNotify(contextList, avatar, equipType)
  }
}

let packet: AvatarEquipChangePacket
export default (() => packet = packet || new AvatarEquipChangePacket())()