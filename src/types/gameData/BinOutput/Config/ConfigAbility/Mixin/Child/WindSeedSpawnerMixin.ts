import ConfigBaseAbilityMixin from '.'

export default interface WindSeedSpawnerMixin extends ConfigBaseAbilityMixin {
  $type: 'WindSeedSpawnerMixin'
  RefreshEnable: boolean
  SpawnerRadius: number
  SpawnerHeightAngle: number
  SpawnerAreaAngle: number
  MinDistanceToAvatar: number
  MoveSuppressSpeed: number
  MoveRefreshAngleFreeze: number
  MoveRefreshAngleSlow: number
  MinNumPerSpawn: number
  MaxNumPerSpawn: number
  MaxSwapNumPerSpawn: number
  MinSeparateRange: number
  MaxSeparateRange: number
  RemoveSeedDistance: number
  RefreshMeterPerMeter: number
  RefreshMeterPerSecond: number
  RefreshMeterPerDistRemove: number
  RefreshMeterMax: number
  WindForceModifier: string
  WindExplodeModifier: string
  WindBulletAbility: string
  GlobalValueKey: string
  SpawnNumArray: number[]
  SeedGadgetID: number
  InitSignalStrength: number
  TriggerSignalStrength: number
  SignalDecaySpeed: number
  MutipleRange: number
  CatchSeedRange: number
}