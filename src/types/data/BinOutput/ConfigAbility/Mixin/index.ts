import ActionConfig from '../Action'
import AttachModifierToSelfGlobalValueMixin from './AttachModifierToSelfGlobalValueMixin'
import AttachToNormalizedTimeMixin from './AttachToNormalizedTimeMixin'
import AttachToPoseIDMixin from './AttachToPoseIDMixin'
import AttachToStateIDMixin from './AttachToStateIDMixin'
import AttackHittingSceneMixin from './AttackHittingSceneMixin'
import DoActionByAnimatorStateIDMixin from './DoActionByAnimatorStateIDMixin'
import DoActionByPoseIDMixin from './DoActionByPoseIDMixin'
import { DoActionByStateIDMixin } from './DoActionByStateIDMixin'
import ModifyElementDecrateMixin from './ModifyElementDecrateMixin'
import SteerAttackMixin from './SteerAttackMixin'

export interface AttachMixin extends Mixin {
  ModifierName: string
}

export interface DoActionMixin extends Mixin {
  EnterAction?: ActionConfig
  ExitAction?: ActionConfig
}

export interface Mixin {
  $type: string
}

type MixinConfig =
  AttachModifierToSelfGlobalValueMixin |
  AttachToNormalizedTimeMixin |
  AttachToPoseIDMixin |
  AttachToStateIDMixin |
  AttackHittingSceneMixin |
  DoActionByAnimatorStateIDMixin |
  DoActionByPoseIDMixin |
  DoActionByStateIDMixin |
  ModifyElementDecrateMixin |
  SteerAttackMixin

export default MixinConfig