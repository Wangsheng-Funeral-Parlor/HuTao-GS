import ConfigBaseAbilityMixin from '.'

export default interface AnimatorRotationCompensateMixin extends ConfigBaseAbilityMixin {
  $type: 'AnimatorRotationCompensateMixin'
  AnimatorStateIDs: string[]
  AnimationRotate: number
  AngleLimit: number
}