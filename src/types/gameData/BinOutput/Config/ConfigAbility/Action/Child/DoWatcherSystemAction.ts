import ConfigBaseAbilityAction from '.'

export default interface DoWatcherSystemAction extends ConfigBaseAbilityAction {
  $type: 'DoWatcherSystemAction'
  WatcherId: number
  AuthorityOnly?: boolean
  InThreatListOnly?: boolean
}