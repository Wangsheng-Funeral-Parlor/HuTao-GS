import { Action } from '.'
import AttackInfoConfig from '../../Common/AttackInfo'
import BornConfig from '../../Common/Born'

export default interface DamageByAttackValue extends Action {
  Attacker?: string
  Born?: BornConfig
  AttackInfo: AttackInfoConfig
}