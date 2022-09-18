import ConfigBaseAbilityAction from '.'

export default interface BroadcastNeuronStimulate extends ConfigBaseAbilityAction {
  $type: 'BroadcastNeuronStimulate'
  NeuronName: string
  Stimulate: boolean
  Range: number
}