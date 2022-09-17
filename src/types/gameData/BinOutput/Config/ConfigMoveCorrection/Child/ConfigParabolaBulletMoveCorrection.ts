import ConfigBaseMoveCorrection from '.'

export default interface ConfigParabolaBulletMoveCorrection extends ConfigBaseMoveCorrection {
  $type: 'ConfigParabolaBulletMoveCorrection'
  Deviation: number
  FixAngleOfVer: number
  MinSpeed: number
  MaxSpeed: number
}