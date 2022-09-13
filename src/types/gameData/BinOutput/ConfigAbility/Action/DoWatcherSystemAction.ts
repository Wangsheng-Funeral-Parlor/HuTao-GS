import { Action } from '.'

export default interface DoWatcherSystemAction extends Action {
  WatcherId: number
  AuthorityOnly?: boolean
  InThreatListOnly?: boolean
}