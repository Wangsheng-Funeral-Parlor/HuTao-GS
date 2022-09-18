import ConfigBaseAbilityAction from '.'

export default interface TriggerSetRenderersEnable extends ConfigBaseAbilityAction {
  $type: 'TriggerSetRenderersEnable'
  RenderNames: string[]
  SetEnable: boolean
}