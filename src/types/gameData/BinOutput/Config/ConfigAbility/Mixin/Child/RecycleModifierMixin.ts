import ConfigBaseAbilityMixin from '.'

export default interface RecycleModifierMixin extends ConfigBaseAbilityMixin {
  $type: 'RecycleModifierMixin'
  ModifierName: string
  Cd: number
  InitialCD: number
}