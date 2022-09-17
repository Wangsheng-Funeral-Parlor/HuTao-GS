import ConfigBaseBulletMove from '.'

export default interface ConfigPinballBulletMove extends ConfigBaseBulletMove {
  $type: 'ConfigPinballBulletMove'
  Radius: number
  TraceOnYAxis: boolean
  DestroyWhenTargetDie: boolean
  RandomBackAngleAdded: number
  ReboundInterval: number
  OutOfRangeFixCD: number
}