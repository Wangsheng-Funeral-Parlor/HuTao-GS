import { Action } from '.'

export default interface SetGlobalValueToOverrideMap extends Action {
  GlobalValueKey: string
  OverrideMapKey: string
}