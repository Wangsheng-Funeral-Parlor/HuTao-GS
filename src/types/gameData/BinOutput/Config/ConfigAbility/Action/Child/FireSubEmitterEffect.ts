import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface FireSubEmitterEffect extends ConfigBaseAbilityAction {
  $type: 'FireSubEmitterEffect'
  EffectPattern: string
  Born: ConfigBornType
  Scale: number
}