import { GadgetInteractRsp } from "#/packets/GadgetInteract"
import GadgetState from "#/packets/GadgetState"
import WorktopOption from "#/packets/WorktopOption"
import Entity from "$/entity"
import GadgetData from "$/gameData/data/GadgetData"
import GrowCurveData from "$/gameData/data/GrowCurveData"
import Player from "$/player"
import { EntityTypeEnum, EventTypeEnum, GadgetStateEnum } from "@/types/enum"
import { SceneGadgetInfo } from "@/types/proto"
import {
  InteractTypeEnum,
  InterOpTypeEnum,
  ProtEntityTypeEnum,
  ResinCostTypeEnum,
  RetcodeEnum,
} from "@/types/proto/enum"
import EntityUserData from "@/types/user/EntityUserData"

export default class Gadget extends Entity {
  gadgetId: number

  interactId: number | null

  gadgetState: GadgetStateEnum

  worktopOption: number[]

  constructor(gadgetId: number) {
    super()

    this.gadgetId = gadgetId
    this.interactId = null

    this.protEntityType = ProtEntityTypeEnum.PROT_ENTITY_GADGET
    this.entityType = EntityTypeEnum.Gadget

    this.gadgetState = GadgetStateEnum.Default

    this.worktopOption = []

    this.gadget = this

    super.initHandlers(this)
  }

  private async loadGadgetData() {
    const { gadgetId } = this

    this.config = await GadgetData.getFightPropConfig(gadgetId)
    this.growCurve = await GrowCurveData.getGrowCurve("Gadget")

    const gadgetData = await GadgetData.getGadget(gadgetId)
    if (!gadgetData) return

    this.name = gadgetData.JsonName
    this.entityType = EntityTypeEnum[gadgetData.Type || ""] || EntityTypeEnum.Gadget

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

  async interact(
    _player: Player,
    opType: InterOpTypeEnum,
    gadgetId: number,
    _isUseCondenseResin: boolean,
    _resinCostType: ResinCostTypeEnum
  ): Promise<GadgetInteractRsp> {
    const { entityId } = this
    return {
      retcode: RetcodeEnum.RET_SUCC,
      gadgetEntityId: entityId,
      interactType: InteractTypeEnum.INTERACT_TYPE_NONE,
      opType,
      gadgetId,
    }
  }

  async setGadgetState(state: GadgetStateEnum, silent = false) {
    const { manager } = this

    this.gadgetState = state

    if (manager.scene.EnableScript && !silent)
      await this.sceneGroup.scene.scriptManager.emit(
        EventTypeEnum.EVENT_GADGET_STATE_CHANGE,
        this.groupId,
        this.configId,
        state
      )

    if (!manager) return

    await GadgetState.broadcastNotify(manager.scene.broadcastContextList, this)
  }

  async setWorktopOption(option: number[]) {
    const { manager } = this

    this.worktopOption = option

    if (!manager) return

    await WorktopOption.broadcastNotify(this.manager.scene.broadcastContextList, this)
  }

  exportSceneGadgetInfo(): SceneGadgetInfo {
    const { gadgetId, groupId, configId, interactId, gadgetState } = this

    const info: SceneGadgetInfo = {
      gadgetId,
      groupId,
      configId,
      gadgetState,
      worktop: {
        optionList: this.worktopOption,
        isGuestCanOperate: false,
      },
    }

    if (interactId != null) {
      info.isEnableInteract = true
      info.interactId = interactId
    }

    return info
  }

  /**Events**/

  // Death
  async handleDeath(seqId?: number, batch = false) {
    const { manager } = this

    if (manager.scene.EnableScript) {
      if (manager.scene.activeChallenge != null) manager.scene.activeChallenge.onGadgetDeath(this)
      await this.sceneGroup?.scene.scriptManager.emit(EventTypeEnum.EVENT_ANY_GADGET_DIE, this.gadgetId)
    }
    await super.handleDeath(seqId, batch)
  }
}
