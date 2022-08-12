import { GadgetBehaviour } from '.'
import CollisionConfig from './Collision'
import TriggerActionsConfig from './TriggerActions'

export default interface ConfigBulletPattern extends GadgetBehaviour {
  Collision: CollisionConfig
  TriggerActions: TriggerActionsConfig
}