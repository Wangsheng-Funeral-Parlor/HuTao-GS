import ConfigAttackPattern from '$DT/BinOutput/Config/ConfigAttackPattern'
import { ConfigBaseAbilityRelationalOperationPredicate } from '.'

export default interface ByAttackNotHitScene extends ConfigBaseAbilityRelationalOperationPredicate {
  $type: 'ByAttackNotHitScene'
  AttackPattern: ConfigAttackPattern
  CheckWaterLayer: boolean
}