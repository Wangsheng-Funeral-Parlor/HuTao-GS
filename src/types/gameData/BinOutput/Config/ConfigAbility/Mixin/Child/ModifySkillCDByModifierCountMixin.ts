import { DynamicFloat } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityMixin from '.'

export default interface ModifySkillCDByModifierCountMixin extends ConfigBaseAbilityMixin {
  $type: 'ModifySkillCDByModifierCountMixin'
  TargetType: string
  ModifierName: string
  SkillID: number
  CdDelta: DynamicFloat
}