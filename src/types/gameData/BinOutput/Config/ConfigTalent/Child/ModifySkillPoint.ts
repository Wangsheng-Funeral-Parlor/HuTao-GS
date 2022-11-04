import ConfigBaseTalentMixin from '.'

export default interface ModifySkillPoint extends ConfigBaseTalentMixin {
  $type: 'ModifySkillPoint'
  SkillID: number
  PointDelta: number
}