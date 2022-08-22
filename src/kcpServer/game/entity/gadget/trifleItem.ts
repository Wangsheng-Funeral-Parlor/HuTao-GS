import { GadgetInteractRsp } from '#/packets/GadgetInteract'
import GuidManager from '$/manager/guidManager'
import Player from '$/player'
import Item from '$/player/inventory/item'
import { SceneGadgetInfo } from '@/types/proto'
import { InteractTypeEnum, InterOpTypeEnum, ResinCostTypeEnum, RetcodeEnum } from '@/types/proto/enum'
import Gadget from '.'

export default class TrifleItem extends Gadget {
  item: Item

  constructor(item: Item) {
    super(item?.gadgetId || 0)

    this.item = item
  }

  async interact(player: Player, opType: InterOpTypeEnum, gadgetId: number, _isUseCondenseResin: boolean, _resinCostType: ResinCostTypeEnum): Promise<GadgetInteractRsp> {
    const { manager, entityId, item } = this
    const { guid } = item
    const { uid, inventory } = player

    if (manager == null) return { retcode: RetcodeEnum.RET_UNKNOWN_ERROR }
    if (GuidManager.parseGuid(guid).uid !== uid) return { retcode: RetcodeEnum.RET_GADGET_INTERACT_COND_NOT_MEET }

    await manager.unregister(this)
    if (!await inventory.addItem(item)) return { retcode: RetcodeEnum.RET_ITEM_EXCEED_LIMIT }

    return {
      retcode: RetcodeEnum.RET_SUCC,
      gadgetEntityId: entityId,
      interactType: InteractTypeEnum.INTERACT_TYPE_PICK_ITEM,
      opType,
      gadgetId
    }
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { item } = this
    const info = super.exportSceneGadgetInfo()

    info.trifleItem = item.export()

    return info
  }

  /**Events**/

  // Unregister
  async handleUnregister() {
    // free guid if item is not added to inventory

    const { item } = this
    const { player, guid } = item
    const { guidManager, inventory } = player

    if (inventory.getItem(guid)) return

    guidManager.freeGuid(guid)
  }
}