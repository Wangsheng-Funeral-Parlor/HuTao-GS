import ConfigBaseAbilityAction from '.'

export default interface SetNeuronEnable extends ConfigBaseAbilityAction {
  $type: 'SetNeuronEnable'
  NeuronName: string
  Enable: boolean
}