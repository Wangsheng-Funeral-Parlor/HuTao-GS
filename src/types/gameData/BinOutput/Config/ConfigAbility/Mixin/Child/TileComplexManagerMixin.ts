import ConfigAttackInfo from '$DT/BinOutput/Config/ConfigAttackInfo'
import ConfigBaseAbilityMixin from '.'

export default interface TileComplexManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'TileComplexManagerMixin'
  AttackID: string
  Interval: number
  SrcCamp: number
  AttackInfo: ConfigAttackInfo
}