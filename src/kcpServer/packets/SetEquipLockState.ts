import StoreItemChange from "./StoreItemChange"

import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SetEquipLockStateReq {
  targetEquipGuid: string
  isLocked: boolean
}

export interface SetEquipLockStateRsp {
  retcode: RetcodeEnum
  targetEquipGuid?: string
  isLocked?: boolean
}

class SetEquipLockStatePacket extends Packet implements PacketInterface {
  constructor() {
    super("SetEquipLockState", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SetEquipLockStateReq): Promise<void> {
    const { player } = context
    const { targetEquipGuid, isLocked } = data

    const item = player.getItem(BigInt(targetEquipGuid))
    if (!item?.equip) {
      await this.response(context, { retcode: RetcodeEnum.RET_ITEM_NOT_EXIST })
      return
    }

    item.equip.isLocked = !!isLocked

    await StoreItemChange.sendNotify(context, [item])

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      targetEquipGuid,
      isLocked,
    })
  }

  async response(context: PacketContext, data: SetEquipLockStateRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SetEquipLockStatePacket
export default (() => (packet = packet || new SetEquipLockStatePacket()))()
