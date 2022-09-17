import ConfigCustomAttackBox from './ConfigCustomAttackBox'
import ConfigCustomAttackCircle from './ConfigCustomAttackCircle'
import ConfigCustomAttackSphere from './ConfigCustomAttackSphere'

export default interface ConfigCustomAttackShape {
  Sphere: ConfigCustomAttackSphere
  Box: ConfigCustomAttackBox
  Circle: ConfigCustomAttackCircle
}