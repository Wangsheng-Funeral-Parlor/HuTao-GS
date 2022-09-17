import ConfigBaseAbilityMixin from '.'
import ConfigAbilityAction from '../../Action'

export default interface DoTileActionManagerMixin extends ConfigBaseAbilityMixin {
  $type: 'DoTileActionManagerMixin'
  Duration: number
  ActionID: string
  ActionPosKey: string
  ActionRadiusKey: string
  Actions: ConfigAbilityAction[]
}