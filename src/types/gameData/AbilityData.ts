import AbilityConfig from './BinOutput/ConfigAbility'

export default interface AbilityDataGroup {
  Animal: {
    [name: string]: AbilityConfig[]
  }
  Avatar: {
    [name: string]: AbilityConfig[]
  }
  Equip: {
    [name: string]: AbilityConfig[]
  }
  Monster: {
    [name: string]: AbilityConfig[]
  }
}