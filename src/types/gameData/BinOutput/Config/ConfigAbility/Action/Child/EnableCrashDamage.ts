import ConfigBaseAbilityAction from '.'

export default interface EnableCrashDamage extends ConfigBaseAbilityAction {
  $type: 'EnableCrashDamage'
  Enable: boolean
}