import ConfigBaseAbilityAction from '.'

export default interface ShowScreenEffect extends ConfigBaseAbilityAction {
  $type: 'ShowScreenEffect'
  EffectType: string
  Show: boolean
}