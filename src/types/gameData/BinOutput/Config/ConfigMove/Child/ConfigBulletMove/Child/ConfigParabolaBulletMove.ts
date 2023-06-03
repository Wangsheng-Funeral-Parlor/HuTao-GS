import ConfigBaseBulletMove from "."

import ConfigMoveCorrection from "$DT/BinOutput/Config/ConfigMoveCorrection"

export default interface ConfigParabolaBulletMove extends ConfigBaseBulletMove {
  $type: "ConfigParabolaBulletMove"
  AngleOffHor: number
  GravityOfAcceleration: number
  Correction: ConfigMoveCorrection
}
