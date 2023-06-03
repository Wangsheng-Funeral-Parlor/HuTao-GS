import ConfigBaseBulletMove from "."

export default interface ConfigItanoCircusBulletMove extends ConfigBaseBulletMove {
  $type: "ConfigItanoCircusBulletMove"
  ItanoCircusStartAngler: number
  DestroyWhenTargetDie: boolean
  GuidanceDelay: number
  GuidanceSpeedChange: boolean
  GuidanceMinAnglerVelocity: number
  GuidanceDuration: number
}
