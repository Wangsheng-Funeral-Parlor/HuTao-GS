import ConfigCollision from '$DT/BinOutput/Config/ConfigCollision'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface CollisionMixin extends ConfigBaseAbilityMixin {
  $type: 'CollisionMixin'
  Collision: ConfigCollision
  MinShockSpeed: number
  Cd: number
  OnCollision: ConfigAbilityAction[]
}