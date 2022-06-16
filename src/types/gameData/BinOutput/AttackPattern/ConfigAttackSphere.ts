import { AttackPattern } from '.'
import BornConfig from '../Common/Born'

export default interface ConfigAttackSphere extends AttackPattern {
  Born: BornConfig
  Radius: number
}