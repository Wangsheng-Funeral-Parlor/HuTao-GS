import AbilityEmbryoConfig from '../Common/AbilityEmbryo'
import CombatConfig from '../Common/Combat'
import CommonConfig from '../Common/Common'
import StateLayerConfig from '../Common/StateLayer'
import DitherConfig from './Dither'
import ModelConfig from './Model'

export default interface MonsterConfig {
  Common: CommonConfig
  Model: ModelConfig
  Dither: DitherConfig
  Combat: CombatConfig
  Abilities: AbilityEmbryoConfig[]
  StateLayers: StateLayerConfig
  InitialPoses: {
    [name: string]: {
      InitialPoseID?: number
      InitialPoseParams?: {
        BoolParams?: { [name: string]: string }
      }
    }
  }
}