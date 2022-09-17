import ConfigBaseAbilityMixin from '.'

export default interface TriggerPostProcessEffectMixin extends ConfigBaseAbilityMixin {
  $type: 'TriggerPostProcessEffectMixin'
  PostEffectAssetName: string
  Duration: number
  IsStageEffect: boolean
}