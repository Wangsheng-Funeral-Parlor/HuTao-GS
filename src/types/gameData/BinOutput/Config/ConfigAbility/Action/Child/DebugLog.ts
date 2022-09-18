import ConfigBaseAbilityAction from '.'

export default interface DebugLog extends ConfigBaseAbilityAction {
  $type: 'DebugLog'
  Content: string
}