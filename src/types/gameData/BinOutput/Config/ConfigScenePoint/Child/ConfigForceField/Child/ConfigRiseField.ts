import { DynamicVector } from '$DT/BinOutput/Common/DynamicNumber'
import ConfigShape from '$DT/BinOutput/Config/ConfigShape'
import ConfigBaseForceField from '.'

export default interface ConfigRiseField extends ConfigBaseForceField {
  $type: 'ConfigRiseField'
  Cdmin: number
  Cdmax: number
  Vmin: number
  Vmax: number
  Hmin: number
  Hmax: number
  Attenuation: number
  Box: DynamicVector
  Shape: ConfigShape
}