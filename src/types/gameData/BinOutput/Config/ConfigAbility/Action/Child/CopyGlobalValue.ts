import ConfigBaseAbilityAction from '.'

export default interface CopyGlobalValue extends ConfigBaseAbilityAction {
  $type: 'CopyGlobalValue'
  SrcTarget: string
  DstTarget: string
  SrcKey: string
  DstKey: string
}