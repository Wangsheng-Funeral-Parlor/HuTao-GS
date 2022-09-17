import ConfigBaseAbilityPredicate from '.'

export default interface ByEntityTypes extends ConfigBaseAbilityPredicate {
  $type: 'ByEntityTypes'
  EntityTypes: string[]
  Reject: boolean
  UseEventSource: boolean
  IsAuthority: number
}