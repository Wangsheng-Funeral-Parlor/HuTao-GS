import ConfigEffectAttachShape from './ConfigEffectAttachShape'

export default interface ConfigEntityCommon {
  EffectAttachShape: ConfigEffectAttachShape
  Mass: number
  Height: number
  ModelHeight: number
  ViewSize: number
  ShadowViewSizeRatio: number
  OverrideCullBoundsRadius: number
  AffectedByWorld: boolean
  CheckInSurface: boolean
  Scale: number
  DisableTickDistance: number
  ForcePauseTickDistance: number
  ShouldPauseAnimatorBeforeReady: boolean
  CanTriggerElementReactionText: boolean
  UseGrassDisplacement: boolean
  MuteElementStickUI: boolean
  HasAfterImage: boolean
  UseDynamicBoneMultiParams: boolean
  EnableCrashDamage: boolean
  ClearAnimatorOnSetLightDeactive: boolean
  ClearAIOnSetLightDeactive: boolean
  UseFinalIK: boolean
}