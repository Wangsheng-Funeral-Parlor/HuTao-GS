import Packet, { PacketContext, PacketInterface } from '#/packet'
import Gadget from '$/entity/gadget'
import { ClientStateEnum } from '@/types/enum'
import { InteractTypeEnum, InterOpTypeEnum, ProtEntityTypeEnum, ResinCostTypeEnum, RetcodeEnum } from '@/types/proto/enum'

export interface GadgetInteractReq {
  gadgetEntityId: number
  opType: InterOpTypeEnum
  gadgetId: number
  isUseCondenseResin: boolean
  resinCostType: ResinCostTypeEnum
}

export interface GadgetInteractRsp {
  retcode: RetcodeEnum
  gadgetEntityId?: number
  interactType?: InteractTypeEnum
  opType?: InterOpTypeEnum
  gadgetId?: number
}

class GadgetInteractPacket extends Packet implements PacketInterface {
  constructor() {
    super('GadgetInteract', {
      reqState: ClientStateEnum.IN_GAME,
      reqStatePass: true
    })
  }

  async request(context: PacketContext, data: GadgetInteractReq): Promise<void> {
    const { player } = context
    const { currentScene } = player
    const { entityManager } = currentScene
    const { gadgetEntityId, opType, gadgetId, isUseCondenseResin, resinCostType } = data

    const entity = <Gadget>entityManager.getEntity(gadgetEntityId, true)
    if (!entity || entity.protEntityType !== ProtEntityTypeEnum.PROT_ENTITY_GADGET) {
      await this.response(context, { retcode: RetcodeEnum.RET_ENTITY_NOT_EXIST })
      return
    }

    await this.response(context, await entity.interact(player, opType, gadgetId, !!isUseCondenseResin, resinCostType))
  }

  async response(context: PacketContext, data: GadgetInteractRsp): Promise<void> {
    await super.response(context, data)
  }
}

let packet: GadgetInteractPacket
export default (() => packet = packet || new GadgetInteractPacket())()