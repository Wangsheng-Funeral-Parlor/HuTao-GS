import ConfigBaseAbilityPredicate from '.'

export default interface ByElementReactionType extends ConfigBaseAbilityPredicate {
  $type: 'ByElementReactionType'
  ReactionType: string
}