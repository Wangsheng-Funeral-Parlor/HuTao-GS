import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DummyMixin extends ConfigBaseAbilityMixin {
  $type: 'DummyMixin'
  ActionList: ConfigAbilityAction[][]
}