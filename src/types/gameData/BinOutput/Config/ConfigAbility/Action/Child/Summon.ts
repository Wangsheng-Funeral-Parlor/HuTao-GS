import { DynamicInt } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityAction from '.'

export default interface Summon extends ConfigBaseAbilityAction {
  $type: 'Summon'
  MonsterID: number
  Born: ConfigBornType
  BornSlotIndex: number
  FaceToTarget: string
  SummonTag: number
  AliveByOwner: boolean
  IsElite: boolean
  AffixList: number[]
  LevelDelta: DynamicInt
  HasDrop: boolean
  HasExp: boolean
  SightGroupWithOwner: boolean
}