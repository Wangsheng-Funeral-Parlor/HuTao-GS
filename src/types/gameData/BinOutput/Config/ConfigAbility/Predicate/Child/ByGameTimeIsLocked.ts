import ConfigBaseAbilityPredicate from '.'

export default interface ByGameTimeIsLocked extends ConfigBaseAbilityPredicate {
  $type: 'ByGameTimeIsLocked'
  IsLocked: boolean
}