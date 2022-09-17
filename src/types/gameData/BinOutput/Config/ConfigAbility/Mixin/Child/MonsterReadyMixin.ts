import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface MonsterReadyMixin extends ConfigBaseAbilityMixin {
  $type: 'MonsterReadyMixin'
  OnMonsterReady: ConfigAbilityAction[]
}