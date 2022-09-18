import ConfigAudioOperation from '$DT/BinOutput/Config/ConfigAudioOperation'
import ConfigBaseAbilityAction from '.'

export default interface TriggerAudio extends ConfigBaseAbilityAction {
  $type: 'TriggerAudio'
  Responder: string
  Operation: ConfigAudioOperation
}