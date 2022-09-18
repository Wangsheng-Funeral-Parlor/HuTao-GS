import ConfigBaseAbilityAction from '.'

export default interface EnablePartControl extends ConfigBaseAbilityAction {
  $type: 'EnablePartControl'
  PartRootNames: string[]
  Enable: boolean
}