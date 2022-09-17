import ConfigBaseAbilityMixin from '.'

export default interface ServerCreateGadgetOnKillMixin extends ConfigBaseAbilityMixin {
  $type: 'ServerCreateGadgetOnKillMixin'
  GadgetIDList: number[]
  CampID: number
  CampTargetType: string
  RandomCreate: boolean
  UseOriginOwnerAsGadgetOwner: boolean
}