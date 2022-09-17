import ConfigSimpleAttackPattern from './ConfigSimpleAttackPattern'

export default interface ConfigAttackTrail extends ConfigSimpleAttackPattern {
  $type: 'ConfigAttackTrail'
  TrailName: string
  TrailStartName: string
}