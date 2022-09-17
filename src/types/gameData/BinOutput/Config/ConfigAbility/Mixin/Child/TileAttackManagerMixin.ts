import ConfigAttackInfo from '$DT/BinOutput/Config/ConfigAttackInfo'
import ConfigBaseAbilityMixin from '.'

export default interface TileAttackManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'TileAttackManagerMixin'
  AttackID: string
  Interval: number
  AttackInfo: ConfigAttackInfo
}