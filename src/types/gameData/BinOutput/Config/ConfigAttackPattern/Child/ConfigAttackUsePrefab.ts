import ConfigBaseAttackPattern from '.'

export default interface ConfigAttackUsePrefab extends ConfigBaseAttackPattern {
  $type: 'ConfigAttackUsePrefab'
  PrefabPathName: string
  IsConnect: boolean
  DurationRawNum: number
}