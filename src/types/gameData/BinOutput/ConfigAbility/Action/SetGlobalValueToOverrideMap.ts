import { Action } from '.'

export default interface SetGlobalValueToOverrideMap extends Action {
  AbilityFormula?: string
  IsFromOwner?: boolean
  GlobalValueKey: string
  OverrideMapKey: string
}