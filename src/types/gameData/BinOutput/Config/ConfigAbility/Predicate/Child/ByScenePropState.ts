import ConfigBaseAbilityPredicate from '.'

export default interface ByScenePropState extends ConfigBaseAbilityPredicate {
  $type: 'ByScenePropState'
  EntityType: string
  State: string
}