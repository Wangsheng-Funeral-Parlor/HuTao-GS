import ConfigBaseBulletMoveAngle from "."

export default interface ConfigBulletMoveAngleByVelocity extends ConfigBaseBulletMoveAngle {
  $type: "ConfigBulletMoveAngleByVelocity"
  TraceLerpCoef: number
}
