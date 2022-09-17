import ConfigBaseAbilityMixin from '.'

export default interface VelocityForceMixin extends ConfigBaseAbilityMixin {
  $type: 'VelocityForceMixin'
  MuteAll: boolean
  UseAll: boolean
  IncludeForces: string[]
  ExcludeForces: string[]
}