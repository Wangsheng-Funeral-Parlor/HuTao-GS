import ConfigBaseAbilityAction from '.'

export default interface FireAudio extends ConfigBaseAbilityAction {
  $type: 'FireAudio'
  AudioPattern: string
  ForcePlay: boolean
}