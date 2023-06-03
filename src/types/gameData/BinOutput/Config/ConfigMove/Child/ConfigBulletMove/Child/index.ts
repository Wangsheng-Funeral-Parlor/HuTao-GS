import ConfigBaseMove from "../.."

import ConfigBulletMoveAngle from "$DT/BinOutput/Config/ConfigBulletMoveAngle"
import ConfigMoveStickToGround from "$DT/BinOutput/Config/ConfigMoveStickToGround"

export default interface ConfigBaseBulletMove extends ConfigBaseMove {
  Speed: number
  MaxSpeed: number
  MinSpeed: number
  AnglerVelocity: number
  Acceleration: number
  AccelerationTime: number
  CanBornInWater: boolean
  UpdateAngle: ConfigBulletMoveAngle
  Delay: number
  StickToGround: ConfigMoveStickToGround
  SyncToRemote: boolean
}
