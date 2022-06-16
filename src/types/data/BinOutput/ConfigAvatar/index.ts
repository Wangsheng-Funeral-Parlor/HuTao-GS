import StateLayerConfig from './StateLayer'
import HeadControlConfig from './HeadControl'
import CommonConfig from './Common'
import CombatConfig from './Combat'
import AbilityConfig from './Ability'
import AudioConfig from './Audio'
import MoveStateEffectConfig from './MoveStateEffect'
import EquipControllerConfig from './EquipController'
import SpecialPointConfig from './SpecialPoint'

export default interface AvatarConfig {
  Common: CommonConfig
  HeadControl: HeadControlConfig
  SpecialPoint: SpecialPointConfig
  Combat: CombatConfig
  EquipController: EquipControllerConfig
  Abilities: AbilityConfig[]
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