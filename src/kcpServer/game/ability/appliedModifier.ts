import BaseClass from '#/baseClass'
import AbilityManager from '$/manager/abilityManager'
import { AbilityAppliedModifier } from '@/types/proto'
import AppliedAbility from './appliedAbility'

export default class AppliedModifier extends BaseClass {
  manager: AbilityManager
  id: number

  ability: AppliedAbility
  localId: number
  attachedParent: boolean
  existsTime: number

  reduceRatio: number
  remainingDurability: number

  constructor(manager: AbilityManager, id: number) {
    super()

    this.manager = manager
    this.id = id

    this.ability = null
    this.localId = 0
    this.attachedParent = false
    this.existsTime = Date.now()

    this.reduceRatio = 0
    this.remainingDurability = 100

    super.initHandlers(this)
  }

  setAbility(ability: AppliedAbility) {
    this.ability = ability || null
  }

  setLocalId(localId: number) {
    this.localId = localId || 0
  }

  setAttachedParent(attachedParent: boolean) {
    this.attachedParent = !!attachedParent
  }

  export(): AbilityAppliedModifier {
    const { id, ability, localId, attachedParent, existsTime, reduceRatio, remainingDurability } = this
    return {
      modifierLocalId: localId,
      parentAbilityName: ability?.abilityName,
      parentAbilityOverride: ability?.abilityOverride,
      instancedModifierId: id,
      instancedAbilityId: ability?.id || 0,
      isAttachedParentAbility: attachedParent,
      existDuration: (Date.now() - existsTime) / 1e3,
      modifierDurability: {
        reduceRatio,
        remainingDurability
      }
    }
  }

  /**Events**/

  // Added
  async handleAdded() {
    return
  }

  // Removed
  async handleRemoved() {
    return
  }
}