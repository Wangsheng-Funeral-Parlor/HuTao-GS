import ConfigBulletMoveAngle from '$DT/BinOutput/Config/ConfigBulletMoveAngle'
import ConfigMoveStickToGround from '$DT/BinOutput/Config/ConfigMoveStickToGround'
import ConfigBaseMove from '../..'

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