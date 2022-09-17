import ConfigBaseGadgetTriggerAction from '.'
import ConfigAttackInfo from '../../ConfigAttackInfo'
import ConfigBornType from '../../ConfigBornType'

export default interface ConfigGadgetDamageByAttackValue extends ConfigBaseGadgetTriggerAction {
  $type: 'ConfigGadgetDamageByAttackValue'
  Born: ConfigBornType
  AttackInfo: ConfigAttackInfo
}