import ConfigBaseAbilityAction from '.'

export default interface AttachElementTypeResistance extends ConfigBaseAbilityAction {
  $type: 'AttachElementTypeResistance'
  ElementType: string
  DurationRatio: number
}