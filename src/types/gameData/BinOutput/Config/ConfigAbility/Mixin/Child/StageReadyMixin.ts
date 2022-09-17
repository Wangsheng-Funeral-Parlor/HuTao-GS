import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface StageReadyMixin extends ConfigBaseAbilityMixin {
  $type: 'StageReadyMixin'
  OnStageReady: ConfigAbilityAction[]
}