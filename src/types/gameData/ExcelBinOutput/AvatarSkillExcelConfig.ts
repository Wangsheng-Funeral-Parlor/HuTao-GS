export interface AvatarSkillExcelConfig {
  Id: number
  NameTextMapHash: number
  AbilityName: string
  DescTextMapHash: number
  SkillIcon: string
  MaxChargeNum: number
  LockShape: string
  LockWeightParams: number[]
  BuffIcon: string
  GlobalValueKey: string

  CostStamina?: number
  IsAttackCameraLock?: boolean
  CdTime?: number
  TriggerID?: number
  DragType?: string
  ShowIconArrow?: boolean
  ProudSkillGroupId?: number
  ForceCanDoSkill?: boolean
  CostElemType?: string
  CostElemVal?: number
  IgnoreCDMinusRatio?: boolean
  IsRanged?: boolean
  NeedMonitor?: string
  DefaultLocked?: boolean
  NeedStore?: boolean
  CdSlot?: number
  EnergyMin?: number
}

type AvatarSkillExcelConfigList = AvatarSkillExcelConfig[]

export default AvatarSkillExcelConfigList
