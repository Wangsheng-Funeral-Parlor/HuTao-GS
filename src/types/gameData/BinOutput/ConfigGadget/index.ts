import AbilityEmbryoConfig from '../Common/AbilityEmbryo'
import CombatConfig from '../Common/Combat'
import CommonConfig from '../Common/Common'
import StateLayerConfig from '../Common/StateLayer'
import GadgetBehaviourConfig from './GadgetBehaviour'
import MoveConfig from './Move'
import TimerConfig from './Timer'

// Incomplete but that's all I need for now
export default interface GadgetConfig {
  Common: CommonConfig
  HasModel: boolean
  Combat: CombatConfig
  AttackAttenuation: string
  Abilities: AbilityEmbryoConfig[]
  Timer: TimerConfig
  Move: MoveConfig
  Gadget: GadgetBehaviourConfig // I should rename everything at some point, but I'm just lazy, anyone else want to do that for me? :D
  StateLayers: { [layer: string]: StateLayerConfig }
}