import ConfigBaseAbilityAction from '.'
import ConfigAbilityAction from '..'

export default interface DummyAction extends ConfigBaseAbilityAction {
  $type: 'DummyAction'
  ActionList: ConfigAbilityAction[]
}