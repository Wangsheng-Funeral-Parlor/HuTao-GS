import ConfigBaseAbilityAction from '.'

export default interface EnableHitBoxByName extends ConfigBaseAbilityAction {
  $type: 'EnableHitBoxByName'
  HitBoxNames: string[]
  SetEnable?: boolean
}