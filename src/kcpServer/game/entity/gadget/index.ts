import { GadgetInteractRsp } from '#/packets/GadgetInteract'
import GadgetState from '#/packets/GadgetState'
import Entity from '$/entity'
import GadgetData from '$/gameData/data/GadgetData'
import GrowCurveData from '$/gameData/data/GrowCurveData'
import Player from '$/player'
import { EntityTypeEnum, GadgetStateEnum } from '@/types/enum'
import { SceneGadgetInfo } from '@/types/proto'
import { InteractTypeEnum, InterOpTypeEnum, ProtEntityTypeEnum, ResinCostTypeEnum, RetcodeEnum } from '@/types/proto/enum'
import EntityUserData from '@/types/user/EntityUserData'

export default class Gadget extends Entity {
  gadgetId: number

  interactId: number | null

  gadgetState: GadgetStateEnum

  constructor(gadgetId: number) {
    super()

    this.gadgetId = gadgetId
    this.interactId = null

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_GADGET
    this.entityType = EntityTypeEnum.Gadget

    this.gadgetState = GadgetStateEnum.Default

    super.initHandlers(this)
  }

  private async loadGadgetData() {
    const { gadgetId } = this

    this.config = await GadgetData.getFightPropConfig(gadgetId)
    this.growCurve = await GrowCurveData.getGrowCurve('Gadget')

    const gadgetData = await GadgetData.getGadget(gadgetId)
    if (!gadgetData) return

    this.name = gadgetData.JsonName
    this.entityType = EntityTypeEnum[gadgetData.Type || ''] || EntityTypeEnum.Gadget

    const { IsInvincible, IsLockHP } = gadgetData.Config?.Combat?.Property || {}
    this.isInvincible = !!IsInvincible
    this.isLockHP = !!IsLockHP

    this.loadAbilities(gadgetData?.Config?.Abilities, true)
  }

  async init(userData: EntityUserData): Promise<void> {
    await this.loadGadgetData()
    super.init(userData)
  }

  async initNew(level?: number): Promise<void> {
    await this.loadGadgetData()
    super.initNew(level)
  }

  async interact(_player: Player, opType: InterOpTypeEnum, gadgetId: number, _isUseCondenseResin: boolean, _resinCostType: ResinCostTypeEnum): Promise<GadgetInteractRsp> {
    const { entityId } = this
    return {
      retcode: RetcodeEnum.RET_SUCC,
      gadgetEntityId: entityId,
      interactType: InteractTypeEnum.INTERACT_TYPE_NONE,
      opType,
      gadgetId
    }
  }

  async setGadgetState(state: GadgetStateEnum) {
    const { manager } = this

    this.gadgetState = state

    if (manager == null) return
    await GadgetState.broadcastNotify(manager.scene.broadcastContextList, this)
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { gadgetId, groupId, configId, interactId, gadgetState } = this

    const info: SceneGadgetInfo = {
      gadgetId,
      groupId,
      configId,
      gadgetState
    }

    if (interactId != null) {
      info.isEnableInteract = true
      info.interactId = interactId
    }

    return info
  }
}