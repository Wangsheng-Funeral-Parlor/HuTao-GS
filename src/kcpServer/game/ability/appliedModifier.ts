import BaseClass from "#/baseClass"
import AbilityData from "$/gameData/data/AbilityData"
import AbilityManager from "$/manager/abilityManager"
import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"
import { AbilityAppliedModifier, AbilityString } from "@/types/proto"

export default class AppliedModifier extends BaseClass {
  manager: AbilityManager
  id: number
  name: string

  abilityId: number
  parentAbilityName: AbilityString
  parentAbilityOverride: AbilityString

  localId: number
  attachedParent: boolean
  applyEntityId: number
  existsTime: number

  reduceRatio: number
  remainingDurability: DynamicFloat
  remainingDurabilityEval: number

  added: boolean

  constructor(manager: AbilityManager, id: number) {
    super()

    this.manager = manager
    this.id = id
    this.name = null

    this.abilityId = 0
    this.parentAbilityName = null
    this.parentAbilityOverride = null

    this.localId = 0
    this.attachedParent = false
    this.applyEntityId = 0
    this.existsTime = Date.now()

    this.reduceRatio = 0
    this.remainingDurability = 0
    this.remainingDurabilityEval = 0

    this.added = false

    super.initHandlers(this)
  }

  private async loadModifierData() {
    const { manager, abilityId, parentAbilityName, localId } = this

    const abilityName = await AbilityData.lookupString(parentAbilityName || manager.getAbility(abilityId)?.abilityName)
    const abilityData = await AbilityData.getAbility(abilityName)
    if (!abilityData) return

    const { Modifiers } = abilityData
    const [modifierName, modifierData] = Object.entries(Modifiers || {})[localId] || []
    if (!modifierName || !modifierData) return

    this.name = modifierName

    this.remainingDurability = modifierData.ElementDurability || 0
  }

  setAbilityId(abilityId: number) {
    if (abilityId == null) return
    this.abilityId = abilityId
  }

  setParentAbility(abilityName: AbilityString, abilityOverride: AbilityString) {
    if (abilityName != null) this.parentAbilityName = abilityName
    if (abilityOverride != null) this.parentAbilityOverride = abilityOverride
  }

  setLocalId(localId: number) {
    if (localId == null) return
    this.localId = localId
  }

  setAttachedParent(attachedParent: boolean) {
    this.attachedParent = !!attachedParent
  }

  setApplyEntityId(applyEntityId: number) {
    if (applyEntityId == null) return
    this.applyEntityId = applyEntityId
  }

  setDurability(reduce: number, remain: number) {
    if (reduce != null) this.reduceRatio = reduce
    if (remain != null) this.remainingDurability = remain
  }

  export(): AbilityAppliedModifier {
    const {
      id,
      abilityId,
      parentAbilityName,
      parentAbilityOverride,
      localId,
      applyEntityId,
      attachedParent,
      existsTime,
      reduceRatio,
      remainingDurabilityEval,
    } = this
    return {
      modifierLocalId: localId,
      parentAbilityName,
      parentAbilityOverride,
      instancedModifierId: id,
      instancedAbilityId: abilityId,
      isAttachedParentAbility: attachedParent,
      existDuration: (Date.now() - existsTime) / 1e3,
      applyEntityId,
      modifierDurability: {
        reduceRatio,
        remainingDurability: remainingDurabilityEval,
      },
    }
  }

  /**Events**/

  // Added
  async handleAdded() {
    const { added } = this

    if (added) return
    this.added = true

    await this.loadModifierData()
  }

  // Removed
  async handleRemoved() {
    const { added } = this

    if (!added) return
    this.added = false
  }
}
