import ConfigBaseSelectTargets from '.'

export default interface SelectTargetsByLCTrigger extends ConfigBaseSelectTargets {
  $type: 'SelectTargetsByLCTrigger'
  CampTargetType: string
}