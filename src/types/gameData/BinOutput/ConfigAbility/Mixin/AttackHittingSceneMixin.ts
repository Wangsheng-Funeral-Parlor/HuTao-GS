import { Mixin } from '.'
import ActionConfig from '../Action'

export default interface AttackHittingSceneMixin extends Mixin {
  OnHittingScene: ActionConfig[]
  AnimEventIDs?: string[]
}