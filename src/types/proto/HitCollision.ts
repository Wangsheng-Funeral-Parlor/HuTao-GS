import { VectorInfo } from '.'
import { HitColliderTypeEnum } from './enum'

export interface HitCollision {
  hitColliderType: HitColliderTypeEnum
  hitBoxIndex: number
  hitPoint: VectorInfo
  hitDir: VectorInfo
  attackeeHitForceAngle: number
  attackeeHitEntityAngle: number
}