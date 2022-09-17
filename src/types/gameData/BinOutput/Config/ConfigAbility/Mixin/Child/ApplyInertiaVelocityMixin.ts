import ConfigBaseAbilityMixin from '.'

export default interface ApplyInertiaVelocityMixin extends ConfigBaseAbilityMixin {
  $type: 'ApplyInertiaVelocityMixin'
  Damping: number
  UseXZ: boolean
  UseY: boolean
}