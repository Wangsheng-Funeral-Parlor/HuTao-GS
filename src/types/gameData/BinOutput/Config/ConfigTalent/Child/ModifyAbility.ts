import ConfigBaseTalentMixin from '.'

export default interface ModifyAbility extends ConfigBaseTalentMixin {
  $type: 'ModifyAbility'
  AbilityName: string
  ParamSpecial: string
  ParamDelta: string
  ParamRatio: string
}