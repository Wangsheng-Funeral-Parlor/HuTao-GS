import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface AttackHittingSceneMixin extends ConfigBaseAbilityMixin {
  $type: 'AttackHittingSceneMixin'
  OnHittingScene: ConfigAbilityAction[]
  AnimEventIDs?: string[]
}