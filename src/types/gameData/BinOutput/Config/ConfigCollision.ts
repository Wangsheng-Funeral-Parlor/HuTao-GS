import ConfigCCD from './ConfigCCD'

export default interface ConfigCollision {
  Ccd: ConfigCCD
  TriggerType: string
  TriggerCD: number
  TargetType: string
  IgnoreScene: boolean
  IgnoreWater: boolean
  BornWithTriggerEnabled: boolean
  DelayEnableCollision: number
}