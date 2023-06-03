import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface TakeoffEquipReq {
  avatarGuid: string
  slot: number
}

export interface TakeoffEquipRsp {
  retcode: RetcodeEnum
  avatarGuid?: string
  slot?: number
}

class TakeoffEquipPacket extends Packet implements PacketInterface {
  constructor() {
    super("TakeoffEquip", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: TakeoffEquipReq): Promise<void> {
    const { player } = context
    const { avatarGuid, slot } = data

    const avatar = player.getAvatar(BigInt(avatarGuid))
    if (!avatar) {
      await this.response(context, { retcode: RetcodeEnum.RET_CAN_NOT_FIND_AVATAR })
      return
    }

    const equip = avatar.equipMap[slot]
    if (!equip) {
      await this.response(context, { retcode: RetcodeEnum.RET_ITEM_NOT_EXIST })
      return
    }

    await avatar.unequip(equip)

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      avatarGuid,
      slot,
    })
  }

  async response(context: PacketContext, data: TakeoffEquipRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: TakeoffEquipPacket
export default (() => (packet = packet || new TakeoffEquipPacket()))()
