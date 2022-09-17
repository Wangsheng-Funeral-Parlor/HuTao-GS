import ConfigBaseAbilityMixin from '.'

export default interface ReplaceEventPatternMixin extends ConfigBaseAbilityMixin {
  $type: 'ReplaceEventPatternMixin'
  OldPatterns: string[]
  NewPatterns: string[]
}