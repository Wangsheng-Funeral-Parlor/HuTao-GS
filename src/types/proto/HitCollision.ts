import { HitColliderTypeEnum } from "./enum"

import { VectorInfo } from "."

export interface HitCollision {
  hitColliderType: HitColliderTypeEnum
  hitBoxIndex: number
  hitPoint: VectorInfo
  hitDir: VectorInfo
  attackeeHitForceAngle: number
  attackeeHitEntityAngle: number
}
