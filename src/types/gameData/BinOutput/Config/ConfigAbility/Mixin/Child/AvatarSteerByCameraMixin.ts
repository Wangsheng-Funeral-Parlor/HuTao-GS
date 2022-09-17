import ConfigBaseAbilityMixin from '.'

export default interface AvatarSteerByCameraMixin extends ConfigBaseAbilityMixin {
  $type: 'AvatarSteerByCameraMixin'
  StateIDs: string[]
  AngularSpeed: number
}