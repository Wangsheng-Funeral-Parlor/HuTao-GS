import ConfigBaseAbilityAction from '.'

export default interface EnablePushColliderName extends ConfigBaseAbilityAction {
  $type: 'EnablePushColliderName'
  PushColliderNames: string[]
  SetEnable: boolean
}