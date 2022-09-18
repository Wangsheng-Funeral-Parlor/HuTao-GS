import RocketJumpExt from '$DT/BinOutput/Config/RocketJumpExt'
import ConfigBaseAbilityAction from '.'

export default interface EnableRocketJump extends ConfigBaseAbilityAction {
  $type: 'EnableRocketJump'
  Type: string
  Enable: boolean
  Extention: RocketJumpExt
}