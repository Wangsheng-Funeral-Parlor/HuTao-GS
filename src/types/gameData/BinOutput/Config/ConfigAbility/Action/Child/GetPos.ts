import ConfigBaseAbilityAction from '.'

export default interface GetPos extends ConfigBaseAbilityAction {
  $type: 'GetPos'
  Key: string
  PosType: string
}