import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'

export default interface ConfigWidgetGadget {
  MaxCountInScene: number
  MaxCountByPlayer: number
  IsCombatDestroy: boolean
  CombatDestroyDistance: number
  IsDistanceDestroy: boolean
  DistanceDestroyDistance: number
  IsHasCollision: boolean
  CollisionIncludeNpc: boolean
  CollisionIncludeWater: boolean
  Radius: number
  DistanceToAvatar: number
  CreateHeight: number
  CreateRot: DynamicVector
}