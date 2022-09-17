import ConfigBaseAbilityAction from '.'

export default interface EnableBulletCollisionPluginTrigger extends ConfigBaseAbilityAction {
  $type: 'EnableBulletCollisionPluginTrigger'
  SetEnable?: boolean
}