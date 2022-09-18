import ConfigBaseAbilityAction from '.'

export default interface SetNeuronMute extends ConfigBaseAbilityAction {
  $type: 'SetNeuronMute'
  NeuronName: string
  Enable: boolean
}