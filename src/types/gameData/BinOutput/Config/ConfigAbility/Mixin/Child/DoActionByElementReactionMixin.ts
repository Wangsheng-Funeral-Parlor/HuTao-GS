import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoActionByElementReactionMixin extends ConfigBaseAbilityMixin {
  $type: 'DoActionByElementReactionMixin'
  Range: number
  EntityTypes: string[]
  EeactionTypes: string[]
  Actions: ConfigAbilityAction[]
}