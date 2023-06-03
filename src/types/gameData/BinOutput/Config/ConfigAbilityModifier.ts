import ConfigAbilityAction from "./ConfigAbility/Action"
import ConfigAbilityMixin from "./ConfigAbility/Mixin"
import ConfigAbilityStateOption from "./ConfigAbilityStateOption"
import ConfigModifierStackingOption from "./ConfigModifierStackingOption"

import { DynamicFloat } from "$DT/BinOutput/Common/DynamicNumber"

export default interface ConfigAbilityModifier {
  TimeScale: string
  Stacking: string
  StackingOption: ConfigModifierStackingOption
  IsBuff: boolean
  IsDebuff: boolean
  ModifierName: string
  IsUnique: boolean
  Duration: DynamicFloat
  ElementType: string
  ElementDurability: DynamicFloat
  MaxElementDurability: number
  PurgeIncrement: number
  IsElementDurabilityMutable: boolean
  ForceTriggerBurning: boolean
  OverrideWeaponElement: boolean
  ThinkInterval: DynamicFloat
  ModifierMixins: ConfigAbilityMixin[]
  TrimThinkInterval: boolean
  Properties: { [key: string]: DynamicFloat }
  State: string
  StateOption: ConfigAbilityStateOption
  MuteStateDisplayEffect: boolean
  ApplyAttackerWitchTimeRatio: boolean
  OnAdded: ConfigAbilityAction[]
  OnRemoved: ConfigAbilityAction[]
  OnBeingHit: ConfigAbilityAction[]
  OnAttackLanded: ConfigAbilityAction[]
  OnHittingOther: ConfigAbilityAction[]
  OnThinkInterval: ConfigAbilityAction[]
  OnKill: ConfigAbilityAction[]
  OnCrash: ConfigAbilityAction[]
  OnAvatarIn: ConfigAbilityAction[]
  OnAvatarOut: ConfigAbilityAction[]
  OnReconnect: ConfigAbilityAction[]
  OnChangeAuthority: ConfigAbilityAction[]
  ForbiddenEntities: string[]
  FireEventWhenApply: boolean
  IsDurabilityGlobal: boolean
  TickThinkIntervalAfterDie: boolean
  ThinkIntervalIgnoreTimeScale: boolean
  ReduceDurablityIgnoreTimeScale: boolean
  IsLimitedProperties: boolean
  ForceSyncToRemote: boolean
  BuffID: number
}
