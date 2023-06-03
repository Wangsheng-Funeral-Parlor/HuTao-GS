import ConfigBaseBulletMove from "."

export default interface ConfigTrackBulletMove extends ConfigBaseBulletMove {
  $type: "ConfigTrackBulletMove"
  DestroyWhenTargetDie: boolean
  TraceOnYAxis: boolean
}
