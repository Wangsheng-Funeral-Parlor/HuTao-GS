import ConfigBaseAbilityAction from '.'

export default interface FireEffectToTarget extends ConfigBaseAbilityAction {
  $type: 'FireEffectToTarget'
  EffectPattern: string
  Reverse: boolean
  FromSelf: boolean
  Scale: number
}