import ConfigBaseMove from '.'

export default interface ConfigRigidbodyMove extends ConfigBaseMove {
  $type: 'ConfigRigidbodyMove'
  ConstSpeedRatio: number
  StartCloseToGround: boolean
  EnableCloseToGroundWhenTick: boolean
  FollowReferenceSystem: boolean
}