import ConfigBaseAbilityAction from '.'

export default interface TriggerFaceAnimation extends ConfigBaseAbilityAction {
  $type: 'TriggerFaceAnimation'
  FaceAnimation: string
}