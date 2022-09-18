import ConfigBaseAbilityAction from '.'

export default interface UpdateReactionDamage extends ConfigBaseAbilityAction {
  $type: 'UpdateReactionDamage'
  LevelTarget: string
  ReactionDamageName: string
}