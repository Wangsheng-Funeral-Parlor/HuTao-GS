import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface PlayerUidNotifyMixin extends ConfigBaseAbilityMixin {
  $type: 'PlayerUidNotifyMixin'
  OpParam: string
  OpType: number
  Logic: string
  Actions: ConfigAbilityAction[]
}