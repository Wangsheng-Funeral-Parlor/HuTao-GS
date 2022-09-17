import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigPickupMulti from './ConfigPickupMulti'

export default interface ConfigPickup {
  PickType: string
  IsStatic: boolean
  DropPointMaxYaw: number
  DropPointMinSpeed: number
  DropPointMaxSpeed: number
  BornEffect: string
  DropEffect: string
  DropOffset: DynamicVector
  EnableScan: boolean
  LockYmove: boolean
  SuspendHeight: number
  SuspendSpeed: number
  SuspendAmplitude: number
  RotateSpeed: number
  RotateVec: DynamicVector
  AttractDelayTime: number
  Multi: ConfigPickupMulti
  DirVec: DynamicVector
  GravityRation: number
  DisableInitJump: boolean
  InitBackSpeed: number
  BackDecelerate: number
  BackFanAngle: number
  BackFanStartAngle: number
  ReboundTimes: number
  ReboundRation: number
  AttractAccelerate: number
  AttractMaxDistance: number
  HeightOffset: number
  RotateDecelerate: DynamicVector
  AttractAudio: string
}