import Packet, { PacketContext, PacketInterface } from '#/packet'
import Avatar from '$/entity/avatar'
import { EquipTypeEnum } from '@/types/enum'
import { SceneReliquaryInfo, SceneWeaponInfo } from '@/types/proto'

export interface AvatarEquipChangeNotify {
  avatarGuid: string
  equipType: number
  itemId?: number
  equipGuid?: string
  weapon?: SceneWeaponInfo
  reliquary?: SceneReliquaryInfo
}

class AvatarEquipChangePacket extends Packet implements PacketInterface {
  constructor() {
    super('AvatarEquipChange')
  }

  async sendNotify(context: PacketContext, avatar: Avatar, equipType: EquipTypeEnum = EquipTypeEnum.EQUIP_WEAPON): Promise<void> {
    const notifyData: AvatarEquipChangeNotify = avatar.exportAvatarEquipChange(equipType)

    await super.sendNotify(context, notifyData)
  }

  async broadcastNotify(contextList: PacketContext[], avatar: Avatar, equipType: EquipTypeEnum = EquipTypeEnum.EQUIP_WEAPON): Promise<void> {
    await super.broadcastNotify(contextList, avatar, equipType)
  }
}

let packet: AvatarEquipChangePacket
export default (() => packet = packet || new AvatarEquipChangePacket())()