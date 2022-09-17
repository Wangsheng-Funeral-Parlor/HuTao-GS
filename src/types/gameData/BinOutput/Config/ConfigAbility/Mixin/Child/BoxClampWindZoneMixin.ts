import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigBornType from '$DT/BinOutput/Config/ConfigBornType'
import ConfigBaseAbilityMixin from '.'

export default interface BoxClampWindZoneMixin extends ConfigBaseAbilityMixin {
  $type: 'BoxClampWindZoneMixin'
  Size: DynamicVector
  Born: ConfigBornType
  AttracForceStrength: number
  MaxStrengthRange: number
}