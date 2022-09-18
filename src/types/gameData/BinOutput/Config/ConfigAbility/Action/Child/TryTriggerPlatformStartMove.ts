import ConfigBaseAbilityAction from '.'
import ConfigAbilityAction from '..'

export default interface TryTriggerPlatformStartMove extends ConfigBaseAbilityAction {
  $type: 'TryTriggerPlatformStartMove'
  DetectHeight: number
  DetectWidth: number
  EnableRotationOffset: boolean
  FailActions: ConfigAbilityAction[]
  ForceReset: boolean
  ForceTrigger: boolean
}