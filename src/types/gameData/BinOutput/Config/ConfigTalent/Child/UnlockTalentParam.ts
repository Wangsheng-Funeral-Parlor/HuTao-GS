import ConfigBaseTalentMixin from '.'

export default interface UnlockTalentParam extends ConfigBaseTalentMixin {
  $type: 'UnlockTalentParam'
  AbilityName: string
  TalentParam: string
}