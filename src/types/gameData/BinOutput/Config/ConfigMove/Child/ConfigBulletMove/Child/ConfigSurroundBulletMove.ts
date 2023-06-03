import ConfigBaseBulletMove from "."

export default interface ConfigSurroundBulletMove extends ConfigBaseBulletMove {
  $type: "ConfigSurroundBulletMove"
  Clockwise: boolean
  Radius: number
  TraceOnYAxis: boolean
  DestroyWhenTargetDie: boolean
}
