import ConfigBaseAbilityMixin from '.'

export default interface ElementAdjustMixin extends ConfigBaseAbilityMixin {
  $type: 'ElementAdjustMixin'
  ChangeInterval: number
  ElementModifies: { [elemType: string]: string }
}