import ConfigMoveCorrection from '$DT/BinOutput/Config/ConfigMoveCorrection'
import ConfigBaseBulletMove from '.'

export default interface ConfigParabolaBulletMove extends ConfigBaseBulletMove {
  $type: 'ConfigParabolaBulletMove'
  AngleOffHor: number
  GravityOfAcceleration: number
  Correction: ConfigMoveCorrection
}