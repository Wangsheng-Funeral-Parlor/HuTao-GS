import ConfigBornType from "../../ConfigBornType"
import ConfigHitScene from "../../ConfigHitScene"

export default interface ConfigBaseAttackPattern {
  TriggerType: string
  CheckHitLayerType: string
  HitScene: ConfigHitScene
  TriggerCD: number
  FilterByFrame: boolean
  IgnoreMassive: boolean
  EntityAttackFilter: string
  MassiveAttackRatio: number
  Born: ConfigBornType
}
