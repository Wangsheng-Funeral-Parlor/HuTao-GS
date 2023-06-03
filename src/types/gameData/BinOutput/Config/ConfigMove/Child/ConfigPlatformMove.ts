import ConfigRoute from "../../ConfigRoute"

import ConfigBaseMove from "."

export default interface ConfigPlatformMove extends ConfigBaseMove {
  $type: "ConfigPlatformMove"
  AvatarTriggerEventDistance: number
  IsMovingWater: boolean
  Route: ConfigRoute
  DelayType: string
}
