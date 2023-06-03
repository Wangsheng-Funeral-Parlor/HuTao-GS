import Packet, { PacketInterface, PacketContext } from "#/packet"
import { ClientStateEnum } from "@/types/enum"
import { VectorInfo } from "@/types/proto"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SceneAvatarStaminaStepReq {
  useClientRot: boolean
  rot: VectorInfo
}

export interface SceneAvatarStaminaStepRsp {
  retcode: RetcodeEnum
  useClientRot?: boolean
  rot?: VectorInfo
}

class SceneAvatarStaminaStepPacket extends Packet implements PacketInterface {
  constructor() {
    super("SceneAvatarStaminaStep", {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true,
    })
  }

  async request(context: PacketContext, data: SceneAvatarStaminaStepReq): Promise<void> {
    const { player } = context
    const { currentAvatar } = player
    const { useClientRot, rot } = data

    if (!currentAvatar) {
      await this.response(context, { retcode: RetcodeEnum.RET_UNKNOWN_ERROR })
      return
    }

    const { staminaManager } = currentAvatar
    await staminaManager.step()

    await this.response(context, {
      retcode: RetcodeEnum.RET_SUCC,
      useClientRot,
      rot,
    })
  }

  async response(context: PacketContext, data: SceneAvatarStaminaStepRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SceneAvatarStaminaStepPacket
export default (() => (packet = packet || new SceneAvatarStaminaStepPacket()))()
