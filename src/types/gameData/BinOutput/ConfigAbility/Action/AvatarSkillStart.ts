import { Action } from '.'

export default interface AvatarSkillStart extends Action {
  SkillID: number
  CdRatio?: number
  CostStaminaRatio?: number
}