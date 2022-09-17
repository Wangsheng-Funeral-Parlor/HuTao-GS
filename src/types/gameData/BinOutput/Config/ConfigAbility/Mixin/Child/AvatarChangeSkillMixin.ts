import ConfigBaseAbilityMixin from '.'

export default interface AvatarChangeSkillMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarChangeSkillMixin'
  Index: number
  Priority: string
  AimSkillID: number
  JumpSkillID: number
  FlySkillID: number
  ChangeOnAdd: boolean
}