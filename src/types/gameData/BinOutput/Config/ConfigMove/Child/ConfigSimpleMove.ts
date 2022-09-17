import ConfigBaseMove from '.'

export default interface ConfigSimpleMove extends ConfigBaseMove {
  $type: 'ConfigSimpleMove'
  ConstSpeedRatio: number
  FollowReferenceSystem: boolean
}