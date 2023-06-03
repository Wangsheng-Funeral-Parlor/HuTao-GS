import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface ChangeWorldToSingleModeReq {}

export interface ChangeWorldToSingleModeRsp {
  retcode: RetcodeEnum
  quitMpValidTime?: number
}

export interface ChangeWorldToSingleModeNotify {}

class ChangeWorldToSingleModePacket extends Packet implements PacketInterface {
  constructor() {
    super("ChangeWorldToSingleMode", {
      reqState: ClientStateEnum.POST_LOGIN,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, _data: ChangeWorldToSingleModeReq): Promise<void> {
    const { player } = context
    const { hostWorld } = player

    if (!player.isHost()) {
      await this.response(context, { retcode: RetcodeEnum.RET_MP_NOT_IN_MY_WORLD })
      return
    }

    await hostWorld.changeToSingle()
    await this.response(context, { retcode: RetcodeEnum.RET_SUCC })
  }

  async response(context: PacketContext, data: ChangeWorldToSingleModeRsp): Promise<void> {
    await super.response(context, data)
  }

  async sendNotify(context: PacketContext): Promise<void> {
    const notifyData: ChangeWorldToSingleModeNotify = {}

    await super.sendNotify(context, notifyData)
  }
}

let packet: ChangeWorldToSingleModePacket
export default (() => (packet = packet || new ChangeWorldToSingleModePacket()))()
