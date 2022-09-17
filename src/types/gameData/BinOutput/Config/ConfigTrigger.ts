export default interface ConfigTrigger {
  TriggerFlag: string
  ConcernType: string
  Shape: string
  CheckInfinite: boolean
  TriggerInfinite: boolean
  LifeInfinite: boolean
  StartCheckTime: number
  CheckInterval: number
  CheckCount: number
  TriggerInterval: number
  TriggerCount: number
  LifeTime: number
  OverwriteCampType: boolean
  CampType: string
  CheckPoint: boolean
  UseSurfaceHeight: boolean
  UseCollider: boolean
}