import ConfigCharacterAudio from './ConfigCharacterAudio'
import ConfigWwiseString from './ConfigWwiseString'

export default interface ConfigMonsterAudio extends ConfigCharacterAudio {
  $type: 'ConfigMonsterAudio'
  RandomVariantSwitchGroup: ConfigWwiseString
  RandomVariantSwitchValues: ConfigWwiseString[]
}