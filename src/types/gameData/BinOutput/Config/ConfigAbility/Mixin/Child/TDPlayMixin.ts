import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface TDPlayMixin extends ConfigBaseAbilityMixin {
  $type: 'TDPlayMixin'
  TowerType: string
  BaseCD: number
  BaseAttackRange: number
  OnFireActions: ConfigAbilityAction[]
  TowerModifierName: string
  BulletIDs: number[]
  Born: ConfigBornType
  PartRootNames: string[]
  TargetType: string
}