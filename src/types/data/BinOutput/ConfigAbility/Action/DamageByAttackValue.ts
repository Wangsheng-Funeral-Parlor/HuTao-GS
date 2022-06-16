import { Action } from '.'
import AttackInfoConfig from '../../Common/AttackInfo'
import BornConfig from '../../Common/Born'
import PredicateConfig from '../Predicate'

export default interface DamageByAttackValue extends Action {
  Target: string
  Predicates?: PredicateConfig[]
  Born?: BornConfig
  AttackInfo: AttackInfoConfig
}