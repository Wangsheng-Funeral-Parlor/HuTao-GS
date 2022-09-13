import { Action } from '.'

export default interface ApplyModifier extends Action {
  ModifierName: string
}