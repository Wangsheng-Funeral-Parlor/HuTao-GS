import Packet, { PacketInterface, PacketContext } from "#/packet"
import Gadget from "$/entity/gadget"
import { EventTypeEnum } from "@/types/enum"
import { RetcodeEnum } from "@/types/proto/enum"

export interface SelectWorktopOptionReq {
  gadgetEntityId: number
  optionId: number
}

export interface SelectWorktopOptionRsp {
  gadgetEntityId: number
  retcode: RetcodeEnum
  optionId: number
}

class SelectWorktopOptionPacket extends Packet implements PacketInterface {
  constructor() {
    super("SelectWorktopOption")
  }

  async request(context: PacketContext, data: SelectWorktopOptionReq): Promise<void> {
    const { player } = context
    const { currentScene } = player
    const { entityManager } = currentScene
    const { gadgetEntityId, optionId } = data
    const entity = <Gadget>entityManager.getEntity(gadgetEntityId, true)

    if (context.player.currentScene.EnableScript)
      await entity.sceneGroup.scene.scriptManager.emit(
        EventTypeEnum.EVENT_SELECT_OPTION,
        entity.groupId,
        entity.configId,
        optionId
      )

    await this.response(context, {
      gadgetEntityId,
      retcode: RetcodeEnum.RET_SUCC,
      optionId,
    })
  }

  async response(context: PacketContext, data: SelectWorktopOptionRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: SelectWorktopOptionPacket
export default (() => (packet = packet || new SelectWorktopOptionPacket()))()
