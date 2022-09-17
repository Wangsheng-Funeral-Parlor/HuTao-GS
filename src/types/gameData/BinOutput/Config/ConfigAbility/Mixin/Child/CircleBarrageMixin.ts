import ConfigBaseAbilityMixin from '.'

export default interface CircleBarrageMixin extends ConfigBaseAbilityMixin {
  $type: 'CircleBarrageMixin'
  BulletID: number
  InnerRadius: number
  CutNum: number
  WaveNum: number
  WaveCD: number
  WavebulletNum: number
  Waveangle: number
  TriggerCD: number
  ShootPoint: string
}