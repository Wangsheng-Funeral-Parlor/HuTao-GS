import Packet, { PacketInterface, PacketContext } from '#/packet'
import { RetcodeEnum } from '@/types/proto/enum'
import { ClientStateEnum } from '@/types/enum'

export interface WearEquipReq {
  avatarGuid: string
  equipGuid: string
}

export interface WearEquipRsp {
  retcode: RetcodeEnum
  avatarGuid?: string
  equipGuid?: string
}

class WearEquipPacket extends Packet implements PacketInterface {
  constructor() {
    super('WearEquip', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: WearEquipReq): Promise<void> {
    const { player } = context
    const { avatarGuid, equipGuid } = data

    const avatar = player.getAvatar(BigInt(avatarGuid))
    const equip = player.getEquip(BigInt(equipGuid))

    if (!avatar) {
      await this.response(context, { retcode: RetcodeEnum.RET_CAN_NOT_FIND_AVATAR })
      return
    }
    if (!equip) {
      await this.response(context, { retcode: RetcodeEnum.RET_ITEM_NOT_EXIST })
      return
    }

    await avatar.equip(equip)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      avatarGuid,
      equipGuid
    })
  }

  async response(context: PacketContext, data: WearEquipRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: WearEquipPacket
export default (() => packet = packet || new WearEquipPacket())()