import ConfigBaseAbilityAction from '.'

export default interface RemoveVelocityForce extends ConfigBaseAbilityAction {
  $type: 'RemoveVelocityForce'
  Forces: string[]
}