import CombatConfig from '../Common/Combat'
import CommonConfig from '../Common/Common'
import StateLayerConfig from '../Common/StateLayer'
import AbilityEmbryoConfig from '../Common/AbilityEmbryo'
import AudioConfig from './Audio'
import EquipControllerConfig from './EquipController'
import HeadControlConfig from './HeadControl'
import MoveStateEffectConfig from './MoveStateEffect'
import SpecialPointConfig from './SpecialPoint'

export default interface AvatarConfig {
  Common: CommonConfig
  HeadControl: HeadControlConfig
  SpecialPoint: SpecialPointConfig
  Combat: CombatConfig
  EquipController: EquipControllerConfig
  Abilities: AbilityEmbryoConfig[]
  StateLayers: { [layer: string]: StateLayerConfig }
  Audio: AudioConfig
  MoveStateEffect: MoveStateEffectConfig
  Perform: {
    [name: string]: {
      MinTime: number
      MaxTime: number
      PerformIDs: number[]
    }
  }
}