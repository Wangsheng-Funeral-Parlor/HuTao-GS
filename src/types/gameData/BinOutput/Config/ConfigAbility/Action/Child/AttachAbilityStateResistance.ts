import ConfigBaseAbilityAction from '.'

export default interface AttachAbilityStateResistance extends ConfigBaseAbilityAction {
  $type: 'AttachAbilityStateResistance'
  ResistanceListID: number
  ResistanceBuffDebuffs: string[]
  DurationRatio: number
}