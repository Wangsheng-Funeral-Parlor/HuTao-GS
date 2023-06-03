import ConfigBaseBulletMoveAngle from "."

import { DynamicVector } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigBulletMoveAngleRotating extends ConfigBaseBulletMoveAngle {
  $type: "ConfigBulletMoveAngleRotating"
  AngularVelocity: DynamicVector
}
