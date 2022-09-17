import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface VelocityDetectMixin extends ConfigBaseAbilityMixin {
  $type: 'VelocityDetectMixin'
  MinSpeed: number
  MaxSpeed: number
  DetectOnStart: boolean
  OnPoseedge: ConfigAbilityAction[]
  OnNegedge: ConfigAbilityAction[]
}