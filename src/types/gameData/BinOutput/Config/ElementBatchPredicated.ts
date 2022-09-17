import ConfigAbilityAction from './ConfigAbility/Action'

export default interface ElementBatchPredicated {
  ElementTypeArr: string[]
  SuccessActions: ConfigAbilityAction[]
  FailActions: ConfigAbilityAction[]
}