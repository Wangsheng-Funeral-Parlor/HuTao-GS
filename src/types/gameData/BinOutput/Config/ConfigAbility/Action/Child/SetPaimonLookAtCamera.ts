import ConfigBaseAbilityAction from '.'

export default interface SetPaimonLookAtCamera extends ConfigBaseAbilityAction {
  $type: 'SetPaimonLookAtCamera'
  From: string
  Lookat: boolean
  MinTime: number
  MaxTime: number
}