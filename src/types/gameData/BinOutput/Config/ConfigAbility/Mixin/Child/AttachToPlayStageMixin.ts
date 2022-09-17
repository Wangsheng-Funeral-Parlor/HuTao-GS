import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface AttachToPlayStageMixin extends ConfigBaseAbilityMixin {
  $type: 'AttachToPlayStageMixin'
  Stage: number
  Actions: ConfigAbilityAction[]
}