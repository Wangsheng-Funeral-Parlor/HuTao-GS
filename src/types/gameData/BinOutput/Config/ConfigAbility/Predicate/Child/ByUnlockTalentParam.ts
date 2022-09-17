import ConfigBaseAbilityPredicate from '.'

export default interface ByUnlockTalentParam extends ConfigBaseAbilityPredicate {
  $type: 'ByUnlockTalentParam'
  TalentParam: string
}