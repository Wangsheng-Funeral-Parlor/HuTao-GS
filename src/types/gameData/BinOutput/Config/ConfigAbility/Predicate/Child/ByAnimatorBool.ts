import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByAnimatorBool extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByAnimatorBool'
  Value: boolean
  Parameter: string
}