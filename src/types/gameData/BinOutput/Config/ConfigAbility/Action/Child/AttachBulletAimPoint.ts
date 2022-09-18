import ConfigBaseAbilityAction from '.'

export default interface AttachBulletAimPoint extends ConfigBaseAbilityAction {
  $type: 'AttachBulletAimPoint'
  BulletAimPoint: string
}