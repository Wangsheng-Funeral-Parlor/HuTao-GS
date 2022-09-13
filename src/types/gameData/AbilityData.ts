import AbilityGroupConfig from './BinOutput/AbilityGroup'
import AbilityConfig from './BinOutput/ConfigAbility'

export default interface AbilityDataGroup {
  Animal: {
    [name: string]: { [override: string]: AbilityConfig }[]
  }
  Avatar: {
    [name: string]: { [override: string]: AbilityConfig }[]
  }
  Equip: {
    [name: string]: { [override: string]: AbilityConfig }[]
  }
  Gadget: {
    [name: string]: { [override: string]: AbilityConfig }[]
  }
  Monster: {
    [name: string]: { [override: string]: AbilityConfig }[]
  }
  Group: {
    [name: string]: AbilityGroupConfig
  }
}