import ConfigBaseAbilityAction from '.'

export default interface ChangeTag extends ConfigBaseAbilityAction {
  $type: 'ChangeTag'
  IsAdd: boolean
  Tag: string
}