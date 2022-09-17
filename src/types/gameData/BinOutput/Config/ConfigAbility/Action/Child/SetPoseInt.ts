import ConfigBaseAbilityAction from '.'

export default interface SetPoseInt extends ConfigBaseAbilityAction {
  $type: 'SetPoseInt'
  IntID: string
  Value: number
}