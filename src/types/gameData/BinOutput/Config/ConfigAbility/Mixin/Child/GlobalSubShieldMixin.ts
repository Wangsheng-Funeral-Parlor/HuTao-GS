import ConfigBaseAbilityMixin from '.'

export default interface GlobalSubShieldMixin extends ConfigBaseAbilityMixin {
  $type: 'GlobalSubShieldMixin'
  MainShieldModifierName: string
  NotifyMainshieldWhenHit: boolean
}