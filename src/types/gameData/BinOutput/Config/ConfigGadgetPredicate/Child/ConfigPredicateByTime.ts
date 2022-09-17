import ConfigBaseGadgetPredicate from '.'

export default interface ConfigPredicateByTime extends ConfigBaseGadgetPredicate {
  $type: 'ConfigPredicateByTime'
  IsNight: boolean
}