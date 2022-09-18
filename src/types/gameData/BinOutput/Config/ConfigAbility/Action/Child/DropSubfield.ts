import ConfigBaseAbilityAction from '.'

export default interface DropSubfield extends ConfigBaseAbilityAction {
  $type: 'DropSubfield'
  SubfieldName: string
}