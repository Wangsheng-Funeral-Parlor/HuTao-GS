import ActionConfig from './Action'
import MixinConfig from './Mixin'

export default interface AbilityConfig {
  $type: string
  AbilityName: string
  AbilityMixins: MixinConfig[]
  AbilitySpecials?: {
    [key: string]: number
  }
  Modifiers?: {
    [name: string]: {
      Stacking?: string
      ModifierName: string
      IsUnique?: boolean
      Duration?: number | string
      ElementType?: string
      ElementDurability: number
      ThinkInterval?: number
      ModifierMixins?: MixinConfig[]
      Properties?: { [key: string]: number }
      State?: string

      OnAdded?: ActionConfig[]
      OnRemoved?: ActionConfig[]
      OnBeingHit?: ActionConfig[]
      OnAttackLanded?: ActionConfig[]
      OnHittingOther?: ActionConfig[]
      OnThinkInterval?: ActionConfig[]
      OnKill?: ActionConfig[]
      OnCrash?: ActionConfig[]
      OnAvatarIn?: ActionConfig[]
      OnAvatarOut?: ActionConfig[]
      OnReconnect?: ActionConfig[]
      OnChangeAuthority?: ActionConfig[]
    }
  }
  OnAdded?: ActionConfig[]
  OnRemoved?: ActionConfig[]
  OnAbilityStart?: ActionConfig[]
  OnKill?: ActionConfig[]
  OnFieldEnter?: ActionConfig[]
  OnFieldExit?: ActionConfig[]
  OnAttach?: ActionConfig[]
  OnDetach?: ActionConfig[]
  OnAvatarIn?: ActionConfig[]
  OnAvatarOut?: ActionConfig[]
  OnTriggerAvatarRay?: ActionConfig[]
  IsDynamicAbility?: boolean
}