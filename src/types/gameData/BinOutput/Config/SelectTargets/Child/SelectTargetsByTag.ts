import ConfigBaseSelectTargets from '.'

export default interface SelectTargetsByTag extends ConfigBaseSelectTargets {
  $type: 'SelectTargetsByTag'
  Tag: string
}