import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface AttachEffect extends ConfigBaseAbilityAction {
  $type: 'AttachEffect'
  EffectPattern: string
  Born?: ConfigBornType
  Scale?: number
  EffectTempleteID?: number
}