import ConfigBaseAbilityAction from '.'

export default interface SetPaimonLookAtAvatar extends ConfigBaseAbilityAction {
  $type: 'SetPaimonLookAtAvatar'
  From: string
  Lookat: boolean
  MinTime: number
  MaxTime: number
}