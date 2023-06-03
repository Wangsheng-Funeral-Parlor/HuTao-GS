import { AnimatorParameterValueInfo } from "."

export interface EvtAnimatorParameterInfo {
  entityId: number
  nameId: number
  isServerCache: boolean
  value: AnimatorParameterValueInfo
}
