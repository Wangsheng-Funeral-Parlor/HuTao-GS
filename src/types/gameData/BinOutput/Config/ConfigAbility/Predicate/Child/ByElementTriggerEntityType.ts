import ConfigBaseAbilityPredicate from '.'

export default interface ByElementTriggerEntityType extends ConfigBaseAbilityPredicate {
  $type: 'ByElementTriggerEntityType'
  EntityTypes: string[]
  ForcebyOriginOwner: boolean
}