import ConfigBaseAbilityAction from '.'

export default interface ClearGlobalValue extends ConfigBaseAbilityAction {
  $type: 'ClearGlobalValue'
  Key: string
}