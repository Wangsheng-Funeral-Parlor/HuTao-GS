import { Mixin } from '.'

export default interface AttachModifierToSelfGlobalValueMixin extends Mixin {
  GlobalValueKey: string
  DefaultGlobalValueOnCreate: number
  ValueSteps: number[]
  ModifierNameSteps: string[]
}