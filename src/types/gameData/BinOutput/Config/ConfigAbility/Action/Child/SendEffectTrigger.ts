import ConfigBaseAbilityAction from '.'

export default interface SendEffectTrigger extends ConfigBaseAbilityAction {
  $type: 'SendEffectTrigger'
  Parameter: string
  Type?: string
  Value?: number
  EffectPattern: string
}