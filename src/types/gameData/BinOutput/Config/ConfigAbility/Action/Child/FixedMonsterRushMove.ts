import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface FixedMonsterRushMove extends ConfigBaseAbilityAction {
  $type: 'FixedMonsterRushMove'
  ToPos: ConfigBornType
  TimeRange: number
  MaxRange?: number
  AnimatorStateIDs: string[]
  OverrideMoveCollider: string
  IsInAir?: boolean
  CheckAnimatorStateOnExitOnly?: boolean
}