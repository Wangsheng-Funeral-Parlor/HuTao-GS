import Vector from '../Common/Vector'
import { AttackPattern } from '.'
import BornConfig from '../Common/Born'

export default interface ConfigAttackBox extends AttackPattern {
  CheckHitLayerType?: string
  Born: BornConfig
  Size: Vector
}