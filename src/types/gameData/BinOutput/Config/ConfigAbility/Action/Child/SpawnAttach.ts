import ConfigBaseAbilityAction from '.'

export default interface SpawnAttach extends ConfigBaseAbilityAction {
  $type: 'SpawnAttach'
  Enable: boolean
  AttachName: string
}