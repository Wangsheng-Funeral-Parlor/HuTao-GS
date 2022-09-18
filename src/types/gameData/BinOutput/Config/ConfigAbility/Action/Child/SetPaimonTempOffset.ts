import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBaseAbilityAction from '.'

export default interface SetPaimonTempOffset extends ConfigBaseAbilityAction {
  $type: 'SetPaimonTempOffset'
  From: string
  OffSetPos: DynamicVector
  Time: number
}