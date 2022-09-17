import ConfigPredicateByInteract from './Child/ConfigPredicateByInteract'
import ConfigPredicateByPlatform from './Child/ConfigPredicateByPlatform'
import ConfigPredicateByTime from './Child/ConfigPredicateByTime'

type ConfigGadgetPredicate =
  ConfigPredicateByInteract |
  ConfigPredicateByPlatform |
  ConfigPredicateByTime

export default ConfigGadgetPredicate