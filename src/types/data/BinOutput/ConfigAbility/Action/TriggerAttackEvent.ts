import { Action } from '.'
import AttackInfoConfig from '../../Common/AttackInfo'
import AttackPatternConfig from '../../AttackPattern'

export default interface TriggerAttackEvent extends Action {
  AttackEvent: {
    AttackPattern: AttackPatternConfig
    AttackInfo: AttackInfoConfig
  }
  TargetType: string
}