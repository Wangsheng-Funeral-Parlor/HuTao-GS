import { Action } from '.'
import { DynamicNumber } from '../../Common/Dynamic'

export default interface AvatarSkillStart extends Action {
  SkillID: number
  CdRatio?: DynamicNumber | number
  CostStaminaRatio?: DynamicNumber | number
}