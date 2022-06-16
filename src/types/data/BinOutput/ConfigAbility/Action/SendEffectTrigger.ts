import { Action } from '.'

export default interface SendEffectTrigger extends Action {
  Parameter: string
  EffectPattern: string
}