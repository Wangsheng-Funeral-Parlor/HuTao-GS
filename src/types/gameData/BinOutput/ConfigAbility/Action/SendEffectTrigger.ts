import { Action } from '.'

export default interface SendEffectTrigger extends Action {
  Parameter: string
  Type?: string
  Value?: number
  EffectPattern: string
}