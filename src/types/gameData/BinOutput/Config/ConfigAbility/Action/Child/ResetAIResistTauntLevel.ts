import ConfigBaseAbilityAction from '.'

export default interface ResetAIResistTauntLevel extends ConfigBaseAbilityAction {
  $type: 'ResetAIResistTauntLevel'
  ResistTauntLevel: string
}