import AIPoint from './AIPoint'
import ConfigAITSAbilityGlobalValueSetting from './ConfigAITSAbilityGlobalValueSetting'
import ConfigAITSTargetBearingSetting from './ConfigAITSTargetBearingSetting'
import ConfigAITSTargetDistanceSetting from './ConfigAITSTargetDistanceSetting'

export default interface ConfigAIThreatSetting {
  Enable: boolean
  ClearThreatTargetDistance: number
  ClearThreatEdgeDistance: number
  ClearThreatByLostPath: boolean
  ClearThreatByTargetOutOfZone: boolean
  ClearThreatTimerByDistance: number
  ClearThreatTimerByLostPath: number
  ClearThreatTimerByTargetOutOfZone: number
  ViewThreatGrow: number
  HearThreatGrow: number
  FeelThreatGrow: number
  ThreatDecreaseSpeed: number
  ThreatBroadcastRange: number
  ViewAttenuation: AIPoint[]
  HearAttenuation: AIPoint[]
  ResistTauntLevel: string
  AuxScoreChangeTargetCD: number
  AbilityGlobalValueScoreSystem: ConfigAITSAbilityGlobalValueSetting
  TargetDistanceScoreSystem: ConfigAITSTargetDistanceSetting
  TargetBearingScoreSystem: ConfigAITSTargetBearingSetting
}