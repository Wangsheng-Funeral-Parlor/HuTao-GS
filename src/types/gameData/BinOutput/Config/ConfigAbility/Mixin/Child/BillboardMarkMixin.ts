import ConfigBaseAbilityMixin from '.'

export default interface BillboardMarkMixin extends ConfigBaseAbilityMixin {
  $type: 'BillboardMarkMixin'
  IconName: string
  ShowDistance: number
}