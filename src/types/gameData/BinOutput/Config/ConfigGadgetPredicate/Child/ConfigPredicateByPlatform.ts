import ConfigBaseGadgetPredicate from '.'

export default interface ConfigPredicateByPlatform extends ConfigBaseGadgetPredicate {
  $type: 'ConfigPredicateByPlatform'
  IsStart: boolean
}