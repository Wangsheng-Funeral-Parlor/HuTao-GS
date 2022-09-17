import ConfigBaseAbilityMixin from '.'

export default interface HitLevelGaugeMixin extends ConfigBaseAbilityMixin {
  $type: 'HitLevelGaugeMixin'
  FromHitLevel: string
  ToHitLevel: string
  MaxCharge: number
  MinChargeDelta: number
  MaxChargeDelta: number
  FadeTime: number
}