import ConfigBaseGadgetPattern from '.'
import ConfigGadgetTriggerAction from '../../ConfigGadgetTriggerAction'

export default interface ConfigGadgetCollidedPattern extends ConfigBaseGadgetPattern {
  $type: 'ConfigGadgetCollidedPattern'
  CollisionActions: ConfigGadgetTriggerAction[]
  ThisColliderName: string
  TargetColliderName: string
}