import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface FireEffectForStorm extends ConfigBaseAbilityAction {
  $type: 'FireEffectForStorm'
  Born: ConfigBornType
  Height: number
}