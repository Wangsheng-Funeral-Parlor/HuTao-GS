import ConfigAbility from './BinOutput/Config/ConfigAbility'
import ConfigAbilityGroup from './BinOutput/Config/ConfigAbilityGroup'

export default interface AbilityDataGroup {
  Animal: {
    [name: string]: { [override: string]: ConfigAbility }[]
  }
  Avatar: {
    [name: string]: { [override: string]: ConfigAbility }[]
  }
  Equip: {
    [name: string]: { [override: string]: ConfigAbility }[]
  }
  Gadget: {
    [name: string]: { [override: string]: ConfigAbility }[]
  }
  Monster: {
    [name: string]: { [override: string]: ConfigAbility }[]
  }
  Group: {
    [name: string]: ConfigAbilityGroup
  }
}