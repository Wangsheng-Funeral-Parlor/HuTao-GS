import GlobalValuePair from '$DT/BinOutput/Config/GlobalValuePair'
import ConfigBaseAbilityAction from '.'

export default interface SetGlobalValueList extends ConfigBaseAbilityAction {
  $type: 'SetGlobalValueList'
  GlobalValueList: GlobalValuePair[]
}