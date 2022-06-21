import { ProtEntityTypeEnum } from '@/types/enum/entity'
import Entity from '$/entity'
import { SceneGadgetInfo } from '@/types/game/gadget'

export default class Gadget extends Entity {
  gadgetId: number

  interactId: number | null

  constructor(gadgetId: number) {
    super()

    this.gadgetId = gadgetId

    this.config = { PropGrowCurves: [] }
    this.growCurve = []

    this.interactId = null

    this.entityType = ProtEntityTypeEnum.PROT_ENTITY_GADGET
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { gadgetId, groupId, configId, interactId } = this

    const info: SceneGadgetInfo = {
      gadgetId,
      groupId,
      configId
    }

    if (interactId != null) {
      info.isEnableInteract = true
      info.interactId = interactId
    }

    return info
  }
}