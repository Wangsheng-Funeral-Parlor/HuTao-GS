import ConfigBaseAbilityAction from '.'

export default interface AddGlobalValueToTarget extends ConfigBaseAbilityAction {
  $type: 'AddGlobalValueToTarget'
  SrcTarget: string
  DstTarget: string
  SrcKey: string
  DstKey: string
}