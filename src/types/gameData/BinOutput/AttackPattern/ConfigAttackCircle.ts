import { AttackPattern } from '.'
import BornConfig from '../Common/Born'

export default interface ConfigAttackCircle extends AttackPattern {
  TriggerType: string
  Born: BornConfig
  Height: number
  FanAngle?: number
  Radius: number
}