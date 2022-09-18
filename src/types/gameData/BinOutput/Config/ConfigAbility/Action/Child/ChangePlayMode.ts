import ConfigBaseAbilityAction from '.'

export default interface ChangePlayMode extends ConfigBaseAbilityAction {
  $type: 'ChangePlayMode'
  ToPlayMode: string
}