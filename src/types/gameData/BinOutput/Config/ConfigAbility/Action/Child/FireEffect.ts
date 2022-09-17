import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface FireEffect extends ConfigBaseAbilityAction {
  $type: 'FireEffect'
  EffectPattern: string
  OthereffectPatterns?: string[]
  Born: ConfigBornType
  OwnedByLevel?: boolean
  UseY?: boolean
  Scale?: number
  EffectTempleteID?: number
}