import DvalinS01PathEffsInfo from '$DT/BinOutput/Config/DvalinS01PathEffsInfo'
import ConfigBaseAbilityMixin from '.'

export default interface DvalinS01PathEffsMixin extends ConfigBaseAbilityMixin {
  $type: 'DvalinS01PathEffsMixin'
  EffectStart: number
  EffectEnd: number
  EffInfos: DvalinS01PathEffsInfo[]
}