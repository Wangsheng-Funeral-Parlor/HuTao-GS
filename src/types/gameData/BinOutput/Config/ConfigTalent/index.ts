import AddAbility from './Child/AddAbility'
import AddTalentExtraLevel from './Child/AddTalentExtraLevel'
import ModifyAbility from './Child/ModifyAbility'
import ModifySkillCD from './Child/ModifySkillCD'
import ModifySkillCost from './Child/ModifySkillCost'
import ModifySkillPoint from './Child/ModifySkillPoint'
import UnlockControllerConditions from './Child/UnlockControllerConditions'
import UnlockTalentParam from './Child/UnlockTalentParam'

type ConfigTalent =
  AddAbility |
  AddTalentExtraLevel |
  ModifyAbility |
  ModifySkillCD |
  ModifySkillCost |
  ModifySkillPoint |
  UnlockControllerConditions |
  UnlockTalentParam

export default ConfigTalent