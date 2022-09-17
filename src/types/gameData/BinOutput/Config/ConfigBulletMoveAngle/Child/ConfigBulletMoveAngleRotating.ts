import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseBulletMoveAngle from '.'

export default interface ConfigBulletMoveAngleRotating extends ConfigBaseBulletMoveAngle {
  $type: 'ConfigBulletMoveAngleRotating'
  AngularVelocity: DynamicVector
}