import ConfigBaseAbilityAction from '.'

export default interface FireUIEffect extends ConfigBaseAbilityAction {
  $type: 'FireUIEffect'
  EffectPattern: string
  EffectSlot: string
}